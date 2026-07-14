package com.cds.initialconfig.user;

import com.cds.initialconfig.common.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.cds.initialconfig.auth.MailService;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder, MailService mailService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    public List<UserResponse> findAll() {
        return repository.findAll().stream().map(UserResponse::from).toList();
    }

    public UserResponse findByIdResponse(Long id) {
        return UserResponse.from(findByIdOrThrow(id));
    }

    public Usuario findByIdOrThrow(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
    }

    public UserResponse create(UserRequest req) {
        if (req.id() == null) throw new IllegalArgumentException("id es requerido");
        if (req.usuario() == null || req.usuario().isBlank()) throw new IllegalArgumentException("usuario es requerido");
        if (req.usuario().length() > 30) throw new IllegalArgumentException("usuario máximo 30 caracteres");
        if (req.nombre() == null || req.nombre().isBlank()) throw new IllegalArgumentException("nombre es requerido");
        if (req.nombre().length() > 30) throw new IllegalArgumentException("nombre máximo 30 caracteres");
        if (req.email() != null && req.email().length() > 30) throw new IllegalArgumentException("email máximo 30 caracteres");
        if (req.role() == null) throw new IllegalArgumentException("role es requerido");

        String rawPassword = req.password();
        boolean isTemporary = false;
        if (rawPassword == null || rawPassword.isBlank()) {
            rawPassword = generateRandomPassword();
            isTemporary = true;
        }

        Usuario u = Usuario.builder()
            .id(req.id())
            .usuario(req.usuario())
            .nombre(req.nombre())
            .email(req.email())
            .password(passwordEncoder.encode(rawPassword.trim()))
            .role(req.role())
            .areaId(req.areaId())
            .estado(req.estado() != null ? req.estado() : EstadoUsuario.activo)
            .fechaCreacion(LocalDate.now())
            .build();

        UserResponse response = UserResponse.from(repository.save(u));

        if (isTemporary) {
            try {
                mailService.sendInitialPasswordEmail(u.getEmail(), u.getNombre(), u.getUsuario(), rawPassword);
            } catch (Exception e) {
                System.err.println("Error enviando correo de contraseña inicial: " + e.getMessage());
            }
        }

        return response;
    }

    /**
     * PUT recibe un mapa crudo (no un DTO tipado) porque el frontend a veces manda
     * el formulario completo y a veces solo {"password": "..."} (recuperación de
     * contraseña en LoginPage). Con un record no se puede distinguir "campo ausente"
     * de "campo enviado en null" (p. ej. areaId:null al pasar un usuario a SUB_ADMIN),
     * así que se aplica merge campo por campo usando containsKey.
     */
    public UserResponse update(Long id, Map<String, Object> payload) {
        Usuario u = findByIdOrThrow(id);

        if (payload.containsKey("usuario")) {
            String usuario = (String) payload.get("usuario");
            if (usuario == null || usuario.isBlank()) throw new IllegalArgumentException("usuario no puede estar vacío");
            if (usuario.length() > 30) throw new IllegalArgumentException("usuario máximo 30 caracteres");
            u.setUsuario(usuario);
        }
        if (payload.containsKey("nombre")) {
            String nombre = (String) payload.get("nombre");
            if (nombre == null || nombre.isBlank()) throw new IllegalArgumentException("nombre no puede estar vacío");
            if (nombre.length() > 30) throw new IllegalArgumentException("nombre máximo 30 caracteres");
            u.setNombre(nombre);
        }
        if (payload.containsKey("email")) {
            String email = (String) payload.get("email");
            if (email != null && email.length() > 30) throw new IllegalArgumentException("email máximo 30 caracteres");
            u.setEmail(email);
        }
        if (payload.containsKey("password")) {
            Object pw = payload.get("password");
            String hashed = hashOrNull(pw != null ? pw.toString() : null);
            if (hashed != null) u.setPassword(hashed);
        }
        if (payload.containsKey("role")) {
            Object role = payload.get("role");
            if (role != null) u.setRole(Role.valueOf(role.toString()));
        }
        if (payload.containsKey("areaId")) {
            Object areaId = payload.get("areaId");
            u.setAreaId(areaId != null ? ((Number) areaId).longValue() : null);
        }
        if (payload.containsKey("estado")) {
            Object estado = payload.get("estado");
            if (estado != null) u.setEstado(EstadoUsuario.valueOf(estado.toString()));
        }

        return UserResponse.from(repository.save(u));
    }

    public void delete(Long id) {
        Usuario u = findByIdOrThrow(id);
        repository.delete(u);
    }

    private static final java.security.SecureRandom RANDOM = new java.security.SecureRandom();

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder(10);
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(RANDOM.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private String hashOrNull(String rawPassword) {
        if (rawPassword == null || rawPassword.isBlank()) return null;
        return passwordEncoder.encode(rawPassword);
    }
}
