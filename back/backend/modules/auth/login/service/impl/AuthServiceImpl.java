package utez.edu.mx.cpm.backend.modules.auth.login.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginResponse;
import utez.edu.mx.cpm.backend.modules.auth.exceptions.AuthException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.Area;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.Usuario;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.UsuarioRepository;
import utez.edu.mx.cpm.backend.modules.auth.login.service.AuthService;
import utez.edu.mx.cpm.backend.security.JwtService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

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

        return LoginResponse.builder()
                .id(usuario.getId())
                .usuario(usuario.getUsuario())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol().toFrontendValue())
                .areaId(area != null ? area.getId() : null)
                .areaNombre(area != null ? area.getNombre() : null)
                .token(token)
                .build();
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
}


