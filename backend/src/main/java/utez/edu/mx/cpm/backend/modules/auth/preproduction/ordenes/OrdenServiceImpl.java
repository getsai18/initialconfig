package utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.Pedido;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.PedidoEstado;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.PedidoRepository;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.dto.OrdenRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.dto.OrdenResponse;

import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OrdenServiceImpl implements OrdenService {

    private final OrdenRepository ordenRepository;
    private final PedidoRepository pedidoRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<OrdenResponse> findAll(Pageable pageable, String q) {
        Page<Orden> page = q == null || q.isBlank()
                ? ordenRepository.findAll(pageable)
                : ordenRepository.findByPedido_CodigoContainingIgnoreCaseOrDisciplinaContainingIgnoreCase(q.trim(), q.trim(), pageable);
        return page.map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public OrdenResponse findById(Long id) {
        return toResponse(findEntity(id));
    }

    @Override
    public OrdenResponse create(OrdenRequest request) {
        Pedido pedido = findPedido(request.pedidoId());
        int nextIndex = ordenRepository.findByPedido(pedido).size() + 1;
        Orden orden = Orden.builder()
                .pedido(pedido)
                .internalCode(UUID.randomUUID().toString())
                .displayId(pedido.getCodigo() + "-ORD-" + String.format("%03d", nextIndex))
                .disciplina(required(request.disciplina(), "La disciplina es requerida."))
                .tipoDiseno(normalizeOptional(request.tipoDiseno()))
                .calidadMaterial(normalizeOptional(request.calidadMaterial()))
                .tipoUniforme(normalizeOptional(request.tipoUniforme()))
                .prendas(request.prendas() == null ? new ArrayList<>() : new ArrayList<>(request.prendas()))
                .secuenciaAreas(request.secuenciaAreas() == null ? new ArrayList<>() : new ArrayList<>(request.secuenciaAreas()))
                .substepActual(0)
                .estado("NUEVA")
                .build();
        return toResponse(ordenRepository.save(orden));
    }

    @Override
    public OrdenResponse avanzarArea(Long id) {
        Orden orden = findEntity(id);
        int current = orden.getSubstepActual() == null ? 0 : orden.getSubstepActual();
        int next = current + 1;
        int total = orden.getSecuenciaAreas() == null ? 0 : orden.getSecuenciaAreas().size();

        if (total == 0) {
            orden.setEstado("VALIDACION");
        } else if (next < total) {
            orden.setSubstepActual(next);
            orden.setEstado("EN_PROCESO");
        } else {
            orden.setSubstepActual(total);
            orden.setEstado("VALIDACION");
            Pedido pedido = orden.getPedido();
            if (pedido != null && pedido.getEstado() == PedidoEstado.NUEVO) {
                pedido.setEstado(PedidoEstado.EN_PROCESO);
                pedidoRepository.save(pedido);
            }
        }
        return toResponse(ordenRepository.save(orden));
    }

    private Orden findEntity(Long id) {
        if (id == null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El identificador de la orden es requerido.");
        }
        return ordenRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Orden no encontrada."));
    }

    private Pedido findPedido(Long id) {
        if (id == null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El pedido es requerido.");
        }
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));
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

    private OrdenResponse toResponse(Orden orden) {
        return new OrdenResponse(
                orden.getId(),
                orden.getPedido() != null ? orden.getPedido().getId() : null,
                orden.getPedido() != null ? orden.getPedido().getCodigo() : null,
                orden.getInternalCode(),
                orden.getDisplayId(),
                orden.getDisciplina(),
                orden.getTipoDiseno(),
                orden.getCalidadMaterial(),
                orden.getTipoUniforme(),
                orden.getPrendas(),
                orden.getSecuenciaAreas(),
                orden.getSubstepActual(),
                orden.getEstado()
        );
    }
}
