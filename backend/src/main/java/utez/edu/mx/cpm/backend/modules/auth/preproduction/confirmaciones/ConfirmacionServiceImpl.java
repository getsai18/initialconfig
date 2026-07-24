package utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones.dto.ConfirmacionRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones.dto.ConfirmacionResponse;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ConfirmacionServiceImpl implements ConfirmacionService {

    private final ConfirmacionRepository confirmacionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ConfirmacionResponse> findAll(Pageable pageable) {
        List<ConfirmacionResponse> mapped = confirmacionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
        int start = Math.min((int) pageable.getOffset(), mapped.size());
        int end = Math.min(start + pageable.getPageSize(), mapped.size());
        return new PageImpl<>(mapped.subList(start, end), pageable, mapped.size());
    }

    @Override
    public ConfirmacionResponse create(ConfirmacionRequest request) {
        ConfirmacionMaterial confirmacion = ConfirmacionMaterial.builder()
                .pedidoId(required(request.pedidoId(), "pedidoId es requerido"))
                .ordenId(required(request.ordenId(), "ordenId es requerido"))
                .equipo(normalizeOptional(request.equipo()))
                .areaOrigen(normalizeOptional(request.areaOrigen()))
                .areaDestino(normalizeOptional(request.areaDestino()))
                .solicitante(normalizeOptional(request.solicitante()))
                .validador(normalizeOptional(request.validador()))
                .tipo(parseTipo(request.tipo()))
                .fecha(LocalDateTime.now())
                .observaciones(normalizeOptional(request.observaciones()))
                .build();
        return toResponse(confirmacionRepository.save(confirmacion));
    }

    private ConfirmacionTipo parseTipo(String tipo) {
        try {
            return ConfirmacionTipo.valueOf(tipo.trim().toUpperCase());
        } catch (Exception ex) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Tipo de confirmación inválido.");
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

    private ConfirmacionResponse toResponse(ConfirmacionMaterial confirmacion) {
        return new ConfirmacionResponse(
                confirmacion.getId(),
                confirmacion.getPedidoId(),
                confirmacion.getOrdenId(),
                confirmacion.getEquipo(),
                confirmacion.getAreaOrigen(),
                confirmacion.getAreaDestino(),
                confirmacion.getSolicitante(),
                confirmacion.getValidador(),
                confirmacion.getTipo() != null ? confirmacion.getTipo().name() : null,
                confirmacion.getFecha(),
                confirmacion.getObservaciones()
        );
    }
}
