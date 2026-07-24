package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.service.impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.Area;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.AreaRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.service.AreaService;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.RolUsuario;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.Usuario;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.UsuarioRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.service.MailService;

import java.text.Normalizer;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioServiceImpl implements utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.service.UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioServiceImpl.class);
    private static final Pattern DIACRITICS = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

    private final UsuarioRepository usuarioRepository;
    private final AreaRepository areaRepository;
    private final AreaService areaService;
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
        validarRolArea(rol, area);

        String rawPassword = request.getPassword();
        boolean isTemporary = false;
        if (rawPassword == null || rawPassword.isBlank()) {
            rawPassword = generateRandomPassword();
            isTemporary = true;
        }

        Usuario usuario = Usuario.builder()
                .usuario(normalizeRequired(request.getUsuario(), "El usuario es requerido.").toLowerCase())
                .nombre(normalizeRequired(request.getNombre(), "El nombre es requerido."))
                .email(normalizeRequired(request.getEmail(), "El email es requerido."))
                .password(encodePassword(rawPassword.trim()))
                .rol(rol)
                .area(area)
                .activo(Boolean.TRUE)
                .estado(normalizeEstado(request.getEstado(), true))
                .fechaCreacion(java.time.LocalDateTime.now())
                .build();

        UsuarioResponse response = toResponse(usuarioRepository.save(usuario));
        if (area != null) {
            areaService.sincronizarEstado(area.getId());
        }

        if (isTemporary) {
            try {
                mailService.sendInitialPasswordEmail(usuario.getEmail(), usuario.getNombre(), usuario.getUsuario(), rawPassword);
            } catch (Exception e) {
                log.error("No se pudo enviar el correo de contraseña inicial a {}", usuario.getEmail(), e);
            }
        }

        return response;
    }

    @Override
    public UsuarioResponse update(Long id, UsuarioRequest request) {
        Usuario usuario = findEntity(id);
        validateUnique(request, id);

        Long areaAnteriorId = usuario.getArea() != null ? usuario.getArea().getId() : null;
        Area area = resolveArea(request.getAreaId());
        RolUsuario rol = parseRol(request.getRole());
        validarRolArea(rol, area);
        String nuevoEstado = normalizeEstado(request.getEstado(), false);

        if (usuario.getRol() == RolUsuario.ADMIN
                && (rol != RolUsuario.ADMIN || !nuevoEstado.equals(usuario.getEstado()))) {
            throw new AppException(HttpStatus.FORBIDDEN,
                    "El rol y el estado del usuario Administrador no se pueden modificar.");
        }

        usuario.setUsuario(normalizeRequired(request.getUsuario(), "El usuario es requerido.").toLowerCase());
        usuario.setNombre(normalizeRequired(request.getNombre(), "El nombre es requerido."));
        usuario.setEmail(normalizeRequired(request.getEmail(), "El email es requerido."));
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            usuario.setPassword(encodePassword(request.getPassword().trim()));
        }
        usuario.setRol(rol);
        usuario.setArea(area);
        usuario.setActivo("activo".equalsIgnoreCase(nuevoEstado));
        usuario.setEstado(nuevoEstado);

        UsuarioResponse response = toResponse(usuarioRepository.save(usuario));

        // Resincroniza tanto el área anterior (por si el usuario se movió o se
        // desactivó) como la nueva, si son distintas.
        if (areaAnteriorId != null) {
            areaService.sincronizarEstado(areaAnteriorId);
        }
        Long areaNuevaId = area != null ? area.getId() : null;
        if (areaNuevaId != null && !areaNuevaId.equals(areaAnteriorId)) {
            areaService.sincronizarEstado(areaNuevaId);
        }

        return response;
    }

    @Override
    public void delete(Long id) {
        Usuario usuario = findEntity(id);
        if (usuario.getRol() == RolUsuario.ADMIN) {
            throw new AppException(HttpStatus.FORBIDDEN, "El usuario Administrador no se puede eliminar.");
        }
        Long areaId = usuario.getArea() != null ? usuario.getArea().getId() : null;
        usuarioRepository.delete(usuario);
        if (areaId != null) {
            areaService.sincronizarEstado(areaId);
        }
    }

    /**
     * Forzada en el servidor: ADMIN/SUB_ADMIN/MANAGEMENT/ATTENDANCE no llevan
     * área; EMPLOYEE requiere un área que no sea ninguna de las reservadas
     * (Gestión de Ordenes / Atención a Clientes).
     */
    private void validarRolArea(RolUsuario rol, Area area) {
        switch (rol) {
            case ADMIN, SUB_ADMIN, MANAGEMENT, ATTENDANCE -> {
                if (area != null) {
                    throw new AppException(HttpStatus.BAD_REQUEST,
                            "Los roles Administrador, Subadministrador, Gestor de Órdenes y Atención al Cliente no deben tener área asignada.");
                }
            }
            case EMPLOYEE -> {
                if (area == null) {
                    throw new AppException(HttpStatus.BAD_REQUEST, "El rol Empleado requiere un área asignada.");
                }
                String normalizada = normalizar(area.getNombre());
                if (normalizada.contains("gestion de ordenes") || normalizada.contains("atencion a clientes")) {
                    throw new AppException(HttpStatus.BAD_REQUEST,
                            "Esa área está reservada y no puede asignarse al rol Empleado.");
                }
            }
        }
    }

    /** Minúsculas y sin acentos, para comparar nombres de área con tolerancia (ver Usuarios.jsx original). */
    private String normalizar(String value) {
        String descompuesto = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD);
        return DIACRITICS.matcher(descompuesto).replaceAll("").toLowerCase();
    }

    private Usuario findEntity(Long id) {
        if (id == null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El identificador del usuario es requerido.");
        }
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    private void validateUnique(UsuarioRequest request, Long currentId) {
        String usuario = normalizeRequired(request.getUsuario(), "El usuario es requerido.").toLowerCase();
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
                .activo(usuario.getActivo())
                .estado(usuario.getEstado())
                .fechaCreacion(usuario.getFechaCreacion())
                .build();
    }
}
