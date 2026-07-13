package com.cds.initialconfig.auth;

import com.cds.initialconfig.common.exception.AuthException;
import com.cds.initialconfig.common.exception.ResourceNotFoundException;
import com.cds.initialconfig.security.JwtService;
import com.cds.initialconfig.user.EstadoUsuario;
import com.cds.initialconfig.user.UserRepository;
import com.cds.initialconfig.user.UserResponse;
import com.cds.initialconfig.user.Usuario;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    private static final String NO_MATCH_MESSAGE =
        "No se encontró ningún usuario que coincida con ese nombre y correo.";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MailService mailService;
    private final long otpExpirationMinutes;
    private final int otpMaxAttempts;

    public AuthService(
        UserRepository userRepository,
        PasswordResetOtpRepository otpRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        MailService mailService,
        @Value("${app.otp.expiration-minutes}") long otpExpirationMinutes,
        @Value("${app.otp.max-attempts}") int otpMaxAttempts
    ) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.otpExpirationMinutes = otpExpirationMinutes;
        this.otpMaxAttempts = otpMaxAttempts;
    }

    public LoginResponse login(LoginRequest req) {
        Usuario u = userRepository.findByUsuario(req.usuario())
            .orElseThrow(() -> new AuthException("Usuario o contraseña incorrectos"));

        if (u.getPassword() == null || !passwordEncoder.matches(req.password(), u.getPassword())) {
            throw new AuthException("Usuario o contraseña incorrectos");
        }
        if (u.getEstado() == EstadoUsuario.inactivo) {
            throw new AuthException("Tu cuenta está inactiva. Contacta a un administrador.");
        }

        String token = jwtService.generateAccessToken(u);
        return new LoginResponse(token, UserResponse.from(u));
    }

    @Transactional
    public void requestPasswordRecovery(PasswordRecoveryRequest req) {
        Usuario u = userRepository.findByUsuario(req.usuario())
            .orElseThrow(() -> new ResourceNotFoundException(NO_MATCH_MESSAGE));

        if (u.getEmail() == null || !u.getEmail().equalsIgnoreCase(req.email())) {
            throw new ResourceNotFoundException(NO_MATCH_MESSAGE);
        }

        String otpCode = generateSixDigitCode();
        PasswordResetOtp otp = PasswordResetOtp.builder()
            .usuarioId(u.getId())
            .codeHash(passwordEncoder.encode(otpCode))
            .expiresAt(Instant.now().plus(otpExpirationMinutes, ChronoUnit.MINUTES))
            .used(false)
            .attempts(0)
            .build();
        otpRepository.save(otp);

        mailService.sendOtpEmail(u.getEmail(), u.getNombre(), otpCode);
    }

    /**
     * Sin @Transactional a propósito: el incremento de "attempts" en un código
     * incorrecto debe persistir aunque el método termine lanzando AuthException
     * — con @Transactional, el rollback automático por la excepción revertiría
     * ese guardado y el contador de intentos nunca avanzaría.
     */
    public PasswordRecoveryVerifyResponse verifyOtp(PasswordRecoveryVerifyRequest req) {
        Usuario u = userRepository.findByUsuario(req.usuario())
            .orElseThrow(() -> new AuthException("Código inválido o expirado"));

        PasswordResetOtp otp = otpRepository.findTopByUsuarioIdAndUsedFalseOrderByIdDesc(u.getId())
            .orElseThrow(() -> new AuthException("Código inválido o expirado"));

        if (otp.getExpiresAt().isBefore(Instant.now()) || otp.getAttempts() >= otpMaxAttempts) {
            throw new AuthException("Código inválido o expirado");
        }

        if (!passwordEncoder.matches(req.otpCode(), otp.getCodeHash())) {
            otp.setAttempts(otp.getAttempts() + 1);
            otpRepository.save(otp);
            throw new AuthException("Código incorrecto");
        }

        otp.setUsed(true);
        otpRepository.save(otp);

        String resetToken = jwtService.generatePasswordResetToken(u);
        return new PasswordRecoveryVerifyResponse(resetToken);
    }

    @Transactional
    public void resetPassword(PasswordResetRequest req) {
        Claims claims = jwtService.parseWithPurpose(req.resetToken(), JwtService.PURPOSE_PASSWORD_RESET);

        if (req.nuevaPassword().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        Long userId = claims.get("userId", Long.class);
        Usuario u = userRepository.findById(userId)
            .orElseThrow(() -> new AuthException("Token inválido."));

        u.setPassword(passwordEncoder.encode(req.nuevaPassword()));
        userRepository.save(u);
    }

    private String generateSixDigitCode() {
        int code = RANDOM.nextInt(1_000_000);
        return String.format("%06d", code);
    }
}
