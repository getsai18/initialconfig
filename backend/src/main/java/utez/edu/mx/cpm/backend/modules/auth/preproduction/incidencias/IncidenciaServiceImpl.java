package utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto.IncidenciaRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto.IncidenciaResolverRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto.IncidenciaResponse;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IncidenciaServiceImpl implements IncidenciaService {

    private final IncidenciaRepository incidenciaRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<IncidenciaResponse> findAll(Pageable pageable, String estado) {
        List<Incidencia> source;
        if (estado == null || estado.isBlank()) {
            source = incidenciaRepository.findAll();
        } else {
            source = incidenciaRepository.findByEstado(parseEstado(estado));
        }
        List<IncidenciaResponse> mapped = source.stream().map(this::toResponse).toList();
        int start = Math.min((int) pageable.getOffset(), mapped.size());
        int end = Math.min(start + pageable.getPageSize(), mapped.size());
        return new PageImpl<>(mapped.subList(start, end), pageable, mapped.size());
    }

    @Override
    public IncidenciaResponse create(IncidenciaRequest request) {
        Incidencia incidencia = Incidencia.builder()
                .pedidoId(required(request.pedidoId(), "pedidoId es requerido"))
                .ordenId(required(request.ordenId(), "ordenId es requerido"))
                .areaOrigen(normalizeOptional(request.areaOrigen()))
                .areaReporta(normalizeOptional(request.areaReporta()))
                .descripcion(required(request.descripcion(), "descripcion es requerida"))
                .acciones(normalizeOptional(request.acciones()))
                .estado(IncidenciaEstado.ACTIVA)
                .fechaReporte(LocalDateTime.now())
                .build();
        return toResponse(incidenciaRepository.save(incidencia));
    }

    @Override
    public IncidenciaResponse resolver(Long id, IncidenciaResolverRequest request) {
        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Incidencia no encontrada."));
        incidencia.setEstado(IncidenciaEstado.RESUELTA);
        if (request != null) {
            incidencia.setAcciones(normalizeOptional(request.acciones()));
            incidencia.setPersonaValida(normalizeOptional(request.personaValida()));
        }
        return toResponse(incidenciaRepository.save(incidencia));
    }

    private IncidenciaEstado parseEstado(String estado) {
        try {
            return IncidenciaEstado.valueOf(estado.trim().toUpperCase());
        } catch (Exception ex) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Estado de incidencia inválido.");
        }
    }

    private String required(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new AppException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private IncidenciaResponse toResponse(Incidencia incidencia) {
        return new IncidenciaResponse(
                incidencia.getId(),
                incidencia.getPedidoId(),
                incidencia.getOrdenId(),
                incidencia.getAreaOrigen(),
                incidencia.getAreaReporta(),
                incidencia.getDescripcion(),
                incidencia.getAcciones(),
                incidencia.getEstado() != null ? incidencia.getEstado().name() : null,
                incidencia.getFechaReporte(),
                incidencia.getPersonaValida()
        );
    }
}
