package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.Area;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.AreaRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.RolUsuario;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.Usuario;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.UsuarioRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.service.MailService;

import java.util.spi.LocaleServiceProvider;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioServiceImpl implements utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.service.UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final AreaRepository areaRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Override
    @Transactional(readOnly = true)
    public Page<UsuarioResponse> findAll(Pageable pageable, String q) {
        if (q == null || q.isBlank()) {
            return usuarioRepository.findAll(pageable).map(this::toResponse);
        }
        String term = q.trim();
        return usuarioRepository
                .findByNombreContainingIgnoreCaseOrUsuarioContainingIgnoreCaseOrEmailContainingIgnoreCase(term, term, term, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponse findById(Long id) {
        return toResponse(findEntity(id));
    }

    @Override
    public UsuarioResponse create(UsuarioRequest request) {
        validateUnique(request, null);
        Area area = resolveArea(request.getAreaId());
        RolUsuario rol = parseRol(request.getRole());

        String rawPassword = request.getPassword();
        boolean isTemporary = false;
        if (rawPassword == null || rawPassword.isBlank()) {
            rawPassword = generateRandomPassword();
            isTemporary = true;
        }

        Usuario usuario = Usuario.builder()
                .usuario(normalizeRequired(request.getUsuario(), "El usuario es requerido."))
                .nombre(normalizeRequired(request.getNombre(), "El nombre es requerido."))
                .email(normalizeRequired(request.getEmail(), "El email es requerido."))
                .password(encodePassword(rawPassword.trim()))
                .rol(rol)
                .area(area)
                .estado(normalizeEstado(request.getEstado(), true))
                .fechaCreacion(java.time.LocalDateTime.now())
                .build();

        UsuarioResponse response = toResponse(usuarioRepository.save(usuario));

        if (isTemporary) {
            try {
                mailService.sendInitialPasswordEmail(usuario.getEmail(), usuario.getNombre(), usuario.getUsuario(), rawPassword);
            } catch (Exception e) {
                System.err.println("Error enviando correo de contraseña inicial: " + e.getMessage());
            }
        }

        return response;
    }

    @Override
    public UsuarioResponse update(Long id, UsuarioRequest request) {
        Usuario usuario = findEntity(id);
        validateUnique(request, id);

        usuario.setUsuario(normalizeRequired(request.getUsuario(), "El usuario es requerido."));
        usuario.setNombre(normalizeRequired(request.getNombre(), "El nombre es requerido."));
        usuario.setEmail(normalizeRequired(request.getEmail(), "El email es requerido."));
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            usuario.setPassword(encodePassword(request.getPassword().trim()));
        }
        usuario.setRol(parseRol(request.getRole()));
        usuario.setArea(resolveArea(request.getAreaId()));
        usuario.setEstado(normalizeEstado(request.getEstado(), false));

        return toResponse(usuarioRepository.save(usuario));
    }

    @Override
    public void delete(Long id) {
        Usuario usuario = findEntity(id);
        usuarioRepository.delete(usuario);
    }

    private Usuario findEntity(Long id) {
        if (id == null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El identificador del usuario es requerido.");
        }
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    private void validateUnique(UsuarioRequest request, Long currentId) {
        String usuario = normalizeRequired(request.getUsuario(), "El usuario es requerido.");
        String email = normalizeRequired(request.getEmail(), "El email es requerido.");

        usuarioRepository.findByUsuarioIgnoreCase(usuario)
                .filter(existing -> currentId == null || !existing.getId().equals(currentId))
                .ifPresent(existing -> { throw new AppException(HttpStatus.CONFLICT, "Ya existe un usuario con ese nombre de usuario."); });

    }
    

    private Area resolveArea(Long areaId) {
        if (areaId == null) {
            return null;
        }
        return areaRepository.findById(areaId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Área no encontrada."));
    }

    private RolUsuario parseRol(String rol) {
        if (rol == null || rol.isBlank()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El rol es requerido.");
        }
        try {
            return RolUsuario.valueOf(rol.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El rol proporcionado no es válido.");
        }
    }

    private String normalizeRequired(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new AppException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private String normalizeEstado(String estado, boolean create) {
        if (estado == null || estado.isBlank()) {
            return "activo";
        }
        String normalized = estado.trim().toLowerCase();
        if (!normalized.equals("activo") && !normalized.equals("inactivo")) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El estado debe ser 'activo' o 'inactivo'.");
        }
        return normalized;
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

    private String encodePassword(String rawPassword) {
        if (rawPassword.startsWith("$2a$") || rawPassword.startsWith("$2b$") || rawPassword.startsWith("$2y$")) {
            return rawPassword;
        }
        return passwordEncoder.encode(rawPassword);
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .usuario(usuario.getUsuario())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .role(usuario.getRol() != null ? usuario.getRol().name() : null)
                .areaId(usuario.getArea() != null ? usuario.getArea().getId() : null)
                .areaNombre(usuario.getArea() != null ? usuario.getArea().getNombre() : null)
                .estado(usuario.getEstado())
                .fechaCreacion(usuario.getFechaCreacion())
                .build();
    }
}

