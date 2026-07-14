package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.service.impl;

import lombok.RequiredArgsConstructor;
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

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioServiceImpl implements utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.service.UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final AreaRepository areaRepository;
    private final PasswordEncoder passwordEncoder;
    private final utez.edu.mx.cpm.backend.modules.auth.login.service.MailService mailService;

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponse> findAll() {
        return usuarioRepository.findAll().stream().map(this::toResponse).toList();
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

        String generatedPassword = null;
        String finalPasswordStr = request.getPassword();
        if (finalPasswordStr == null || finalPasswordStr.isBlank()) {
            generatedPassword = java.util.UUID.randomUUID().toString().substring(0, 8);
            finalPasswordStr = generatedPassword;
        }

        Usuario usuario = Usuario.builder()
                .usuario(normalizeRequired(request.getUsuario(), "El usuario es requerido."))
                .nombre(normalizeRequired(request.getNombre(), "El nombre es requerido."))
                .email(normalizeRequired(request.getEmail(), "El email es requerido."))
                .password(encodePassword(finalPasswordStr.trim()))
                .rol(rol)
                .area(area)
                .estado(normalizeEstado(request.getEstado(), true))
                .build();

        System.out.println("=> DEBUG CREATE USUARIO: " + usuario.getUsuario() + " | Password set? " + (usuario.getPassword() != null));

        Usuario saved = usuarioRepository.save(usuario);

        if (generatedPassword != null) {
            try {
                mailService.sendNewUserPasswordEmail(saved.getEmail(), saved.getNombre(), generatedPassword);
            } catch (Exception e) {
                // Loguear error pero no revertir la creación de usuario
                System.err.println("Error al enviar correo de bienvenida: " + e.getMessage());
            }
        }

        return toResponse(saved);
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

        System.out.println("=> DEBUG UPDATE USUARIO: " + usuario.getUsuario() + " | Password set? " + (usuario.getPassword() != null));

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

        usuarioRepository.findAll().stream()
                .filter(existing -> existing.getEmail() != null && existing.getEmail().equalsIgnoreCase(email))
                .filter(existing -> currentId == null || !existing.getId().equals(currentId))
                .findFirst();
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

