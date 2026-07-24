package utez.edu.mx.cpm.backend.modules.auth.login.service.impl;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.modules.auth.exceptions.AuthException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.Area;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.Usuario;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.UsuarioRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryVerifyRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryVerifyResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordResetRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.otp.PasswordResetOtp;
import utez.edu.mx.cpm.backend.modules.auth.login.otp.PasswordResetOtpRepository;
import utez.edu.mx.cpm.backend.modules.auth.login.service.AuthService;
import utez.edu.mx.cpm.backend.modules.auth.login.service.MailService;
import utez.edu.mx.cpm.backend.security.JwtService;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private static final String NO_MATCH_MESSAGE =
            "No se encontró ningún usuario que coincida con ese nombre y correo.";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MailService mailService;

    @Value("${app.otp.expiration-minutes:10}")
    private String otpExpirationMinutes;

    @Value("${app.otp.max-attempts:5}")
    private String otpMaxAttempts;

    @Override
    public LoginResponse login(LoginRequest request) {
        if (request == null || request.getUsuario() == null || request.getUsuario().isBlank()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "El usuario es requerido.");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "La contraseña es requerida.");
        }

        String usuarioNormalizado = request.getUsuario().trim();
        Usuario usuario = usuarioRepository.findByUsuarioIgnoreCase(usuarioNormalizado)
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos."));

        if (!"activo".equalsIgnoreCase(usuario.getEstado())) {
            throw new AuthException(HttpStatus.FORBIDDEN, "Este usuario se encuentra inactivo.");
        }

        if (!passwordMatches(request.getPassword(), usuario.getPassword())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos.");
        }

        String token = jwtService.generateToken(usuario);
        Area area = usuario.getArea();

        UsuarioResponse usuarioResponse = UsuarioResponse.builder()
                .id(usuario.getId())
                .usuario(usuario.getUsuario())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .role(usuario.getRol().name())
                .areaId(area != null ? area.getId() : null)
                .areaNombre(area != null ? area.getNombre() : null)
                .activo(usuario.getActivo())
                .estado(usuario.getEstado())
                .fechaCreacion(usuario.getFechaCreacion())
                .build();

        return LoginResponse.builder()
                .token(token)
                .usuario(usuarioResponse)
                .build();
    }

    @Override
    @Transactional
    public void requestPasswordRecovery(PasswordRecoveryRequest request) {
        if (request == null || request.getUsuario() == null || request.getUsuario().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Usuario y email son requeridos.");
        }

        Usuario usuario = usuarioRepository.findByUsuarioIgnoreCase(request.getUsuario().trim())
                .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, NO_MATCH_MESSAGE));

        if (usuario.getEmail() == null || !usuario.getEmail().equalsIgnoreCase(request.getEmail().trim())) {
            throw new AuthException(HttpStatus.NOT_FOUND, NO_MATCH_MESSAGE);
        }

        String otpCode = generateSixDigitCode();
        PasswordResetOtp otp = PasswordResetOtp.builder()
                .usuarioId(usuario.getId())
                .codeHash(passwordEncoder.encode(otpCode))
                .expiresAt(Instant.now().plus(parseLongOrDefault(otpExpirationMinutes, 10L), ChronoUnit.MINUTES))
                .used(false)
                .attempts(0)
                .build();
        otpRepository.save(otp);

        mailService.sendOtpEmail(usuario.getEmail(), usuario.getNombre(), otpCode);
    }

    /**
     * Sin @Transactional a propósito: el incremento de "attempts" en un código
     * incorrecto debe persistir aunque el método termine lanzando AuthException
     * — con @Transactional, el rollback automático por la excepción revertiría
     * ese guardado y el contador de intentos nunca avanzaría.
     */
    @Override
    public PasswordRecoveryVerifyResponse verifyOtp(PasswordRecoveryVerifyRequest request) {
        if (request == null || request.getUsuario() == null || request.getOtpCode() == null) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Usuario y código son requeridos.");
        }

        Usuario usuario = usuarioRepository.findByUsuarioIgnoreCase(request.getUsuario().trim())
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Código inválido o expirado"));

        PasswordResetOtp otp = otpRepository.findTopByUsuarioIdAndUsedFalseOrderByIdDesc(usuario.getId())
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Código inválido o expirado"));

        if (otp.getExpiresAt().isBefore(Instant.now()) || otp.getAttempts() >= parseIntOrDefault(otpMaxAttempts, 5)) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Código inválido o expirado");
        }

        if (!passwordEncoder.matches(request.getOtpCode(), otp.getCodeHash())) {
            otp.setAttempts(otp.getAttempts() + 1);
            otpRepository.save(otp);
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Código incorrecto");
        }

        otp.setUsed(true);
        otpRepository.save(otp);

        String resetToken = jwtService.generatePasswordResetToken(usuario);
        return new PasswordRecoveryVerifyResponse(resetToken);
    }

    @Override
    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        if (request == null || request.getResetToken() == null || request.getNuevaPassword() == null) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "resetToken y nuevaPassword son requeridos.");
        }

        Claims claims = jwtService.parseWithPurpose(request.getResetToken(), JwtService.PURPOSE_PASSWORD_RESET);

        if (request.getNuevaPassword().length() < 6) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos 6 caracteres");
        }

        Long userId = claims.get("userId", Long.class);
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Token inválido."));

        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioRepository.save(usuario);
    }

    private boolean passwordMatches(String rawPassword, String storedPassword) {
        if (storedPassword == null) {
            return false;
        }

        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }

        return rawPassword.equals(storedPassword);
    }

    private String generateSixDigitCode() {
        int code = RANDOM.nextInt(1_000_000);
        return String.format("%06d", code);
    }

    private long parseLongOrDefault(String value, long defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return Long.parseLong(value.trim());
    }

    private int parseIntOrDefault(String value, int defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return Integer.parseInt(value.trim());
    }
}
