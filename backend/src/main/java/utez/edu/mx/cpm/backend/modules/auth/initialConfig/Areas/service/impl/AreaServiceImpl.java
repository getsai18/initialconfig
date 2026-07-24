package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.Area;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.AreaRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto.AreaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto.AreaResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.UsuarioRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AreaServiceImpl implements utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.service.AreaService {

    private final AreaRepository areaRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<AreaResponse> findAll(Pageable pageable, String q) {
        if (q == null || q.isBlank()) {
            return areaRepository.findAll(pageable).map(this::toResponse);
        }
        String term = q.trim();
        return areaRepository.findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(term, term, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AreaResponse findById(Long id) {
        return toResponse(findEntity(id));
    }

    @Override
    public AreaResponse create(AreaRequest request) {
        String nombre = validateName(request.getNombre());
        if (areaRepository.existsByNombreIgnoreCase(nombre)) {
            throw new AppException(HttpStatus.CONFLICT, "Ya existe un área con ese nombre.");
        }

        // El estado no se acepta del cliente: un área recién creada no tiene
        // usuarios asignados todavía, así que siempre nace "inactiva" — igual
        // que el frontend anterior (Areas.jsx openCreate reset a 'inactiva').
        Area area = Area.builder()
                .nombre(nombre)
                .ordenSecuencia(request.getOrdenSecuencia())
                .activa(request.getActiva() == null || request.getActiva())
                .descripcion(normalizeOptional(request.getDescripcion()))
                .estado("inactiva")
                .fechaCreacion(LocalDateTime.now())
                .build();
        return toResponse(areaRepository.save(area));
    }

    @Override
    public AreaResponse update(Long id, AreaRequest request) {
        Area area = findEntity(id);
        String nombre = validateName(request.getNombre());
        boolean duplicate = areaRepository.findByNombreIgnoreCase(nombre)
                .filter(existing -> !existing.getId().equals(id))
                .isPresent();
        if (duplicate) {
            throw new AppException(HttpStatus.CONFLICT, "Ya existe un área con ese nombre.");
        }

        // El estado tampoco se acepta aquí: se ignora cualquier valor que venga
        // en el request y se recalcula según los usuarios asignados, para que
        // no pueda quedar "desincronizado" de un edit manual (ver sincronizarEstado).
        area.setNombre(nombre);
        area.setOrdenSecuencia(request.getOrdenSecuencia());
        if (request.getActiva() != null) {
            area.setActiva(request.getActiva());
        }
        area.setDescripcion(normalizeOptional(request.getDescripcion()));
        area.setEstado(Boolean.TRUE.equals(area.getActiva()) ? "activa" : "inactiva");
        return toResponse(areaRepository.save(area));
    }

    @Override
    public void delete(Long id) {
        Area area = findEntity(id);
        boolean areaInUse = usuarioRepository.existsByArea_Id(area.getId());
        if (areaInUse) {
            throw new AppException(HttpStatus.CONFLICT, "No se puede eliminar el área porque tiene usuarios asignados.");
        }
        areaRepository.delete(area);
    }

    @Override
    public void sincronizarEstado(Long areaId) {
        if (areaId == null) {
            return;
        }
        areaRepository.findById(areaId).ifPresent(area -> {
            boolean activa = usuarioRepository.existsByArea_IdAndEstadoIgnoreCase(areaId, "activo");
            area.setActiva(activa);
            area.setEstado(activa ? "activa" : "inactiva");
            areaRepository.save(area);
        });
    }

    private String calcularEstado(Long areaId) {
        return usuarioRepository.existsByArea_IdAndEstadoIgnoreCase(areaId, "activo") ? "activa" : "inactiva";
    }

    private Area findEntity(Long id) {
        if (id == null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El identificador del área es requerido.");
        }
        return areaRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Área no encontrada."));
    }

    private String validateName(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El nombre del área es requerido.");
        }
        return nombre.trim();
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private AreaResponse toResponse(Area area) {
        return AreaResponse.builder()
                .id(area.getId())
                .nombre(area.getNombre())
                .ordenSecuencia(area.getOrdenSecuencia())
                .activa(area.getActiva())
                .descripcion(area.getDescripcion())
                .estado(area.getEstado())
                .fechaCreacion(area.getFechaCreacion())
                .build();
    }
}
