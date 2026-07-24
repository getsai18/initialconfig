package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.AreaRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.Cliente;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.ClienteRepository;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.kits.Kit;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.kits.KitRepository;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.Orden;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.OrdenRepository;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.dto.OrdenResponse;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoKitRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoKitResponse;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoOrdenRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoOrdenResponse;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final OrdenRepository ordenRepository;
    private final KitRepository kitRepository;
    private final AreaRepository areaRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<PedidoResponse> findAll(Pageable pageable, String q) {
        Page<Pedido> page = q == null || q.isBlank()
                ? pedidoRepository.findAll(pageable)
                : pedidoRepository.search(q.trim(), pageable);
        return page.map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PedidoResponse findById(Long id) {
        return toResponse(findEntity(id));
    }

    @Override
    public PedidoResponse create(PedidoRequest request) {
        Cliente cliente = findCliente(request.clienteId());
        Pedido pedido = Pedido.builder()
                .codigo(generateCodigo())
                .cliente(cliente)
                .fechaRegistro(LocalDateTime.now())
                .fechaEntrega(parseDate(request.fechaEntrega()))
                .prioridad(resolvePrioridad(request.prioridad(), request.fechaEntrega()))
                .estado(parseEstado(request.estado(), PedidoEstado.NUEVO))
                .build();
        pedido = pedidoRepository.save(pedido);

        createOrdenes(pedido, request.ordenes());
        createKits(pedido, request.kits());

        return toResponse(findEntity(pedido.getId()));
    }

    @Override
    public PedidoResponse update(Long id, PedidoRequest request) {
        Pedido pedido = findEntity(id);
        pedido.setCliente(findCliente(request.clienteId()));
        pedido.setFechaEntrega(parseDate(request.fechaEntrega()));
        pedido.setPrioridad(resolvePrioridad(request.prioridad(), request.fechaEntrega()));
        pedido.setEstado(parseEstado(request.estado(), pedido.getEstado()));
        pedidoRepository.save(pedido);
        return toResponse(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResponse> findByClienteId(String clienteId) {
        return pedidoRepository.findByCliente_IdOrderByFechaRegistroDesc(clienteId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private void createOrdenes(Pedido pedido, List<PedidoOrdenRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return;
        }
        int index = 1;
        for (PedidoOrdenRequest request : requests) {
            validateAreaSequence(request.secuenciaAreas());
            Orden orden = Orden.builder()
                    .pedido(pedido)
                    .internalCode(UUID.randomUUID().toString())
                    .displayId(pedido.getCodigo() + "-ORD-" + String.format("%03d", index++))
                    .disciplina(required(request.disciplina(), "La disciplina es requerida."))
                    .tipoDiseno(normalizeOptional(request.tipoDiseno()))
                    .calidadMaterial(normalizeOptional(request.calidadMaterial()))
                    .tipoUniforme(normalizeOptional(request.tipoUniforme()))
                    .prendas(request.prendas() == null ? new ArrayList<>() : new ArrayList<>(request.prendas()))
                    .secuenciaAreas(request.secuenciaAreas() == null ? new ArrayList<>() : new ArrayList<>(request.secuenciaAreas()))
                    .substepActual(0)
                    .estado("NUEVA")
                    .build();
            ordenRepository.save(orden);
        }
    }

    private void createKits(Pedido pedido, List<PedidoKitRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return;
        }
        for (PedidoKitRequest request : requests) {
            Kit kit = Kit.builder()
                    .pedido(pedido)
                    .nombre(required(request.nombre(), "El nombre del kit es requerido."))
                    .descripcion(normalizeOptional(request.descripcion()))
                    .build();
            kitRepository.save(kit);
        }
    }

    private Pedido findEntity(Long id) {
        if (id == null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El identificador del pedido es requerido.");
        }
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));
    }

    private Cliente findCliente(String id) {
        if (id == null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El cliente es requerido.");
        }
        return clienteRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Cliente no encontrado."));
    }

    private void validateAreaSequence(List<Long> secuenciaAreas) {
        if (secuenciaAreas == null) {
            return;
        }
        for (Long areaId : secuenciaAreas) {
            if (areaId != null && !areaRepository.existsById(areaId)) {
                throw new AppException(HttpStatus.NOT_FOUND, "Una de las áreas seleccionadas no existe.");
            }
        }
    }

    private String generateCodigo() {
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        String prefix = "PED-" + now.format(java.time.format.DateTimeFormatter.ofPattern("ddMMyyyyHHmmss"));
        long sequence = pedidoRepository.countByCodigoStartingWith(prefix) + 1;
        return prefix + "-" + String.format("%04d", sequence);
    }

    private LocalDate parseDate(String value) {
        try {
            return LocalDate.parse(value);
        } catch (Exception ex) {
            throw new AppException(HttpStatus.BAD_REQUEST, "La fecha de entrega debe tener formato YYYY-MM-DD.");
        }
    }

    private boolean resolvePrioridad(Boolean priority, String fechaEntrega) {
        if (priority != null) {
            return priority;
        }
        LocalDate date = parseDate(fechaEntrega);
        return !date.isAfter(LocalDate.now().plusDays(2));
    }

    private PedidoEstado parseEstado(String value, PedidoEstado defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        try {
            return PedidoEstado.valueOf(value.trim().toUpperCase());
        } catch (Exception ex) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Estado de pedido inválido.");
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

    private PedidoResponse toResponse(Pedido pedido) {
        List<PedidoOrdenResponse> ordenes = pedido.getOrdenes().stream().map(this::toResponse).toList();
        List<PedidoKitResponse> kits = pedido.getKits().stream().map(this::toResponse).toList();
        return new PedidoResponse(
                pedido.getId(),
                pedido.getCodigo(),
                pedido.getCliente() != null ? pedido.getCliente().getId() : null,
                pedido.getCliente() != null ? pedido.getCliente().getNombre() : null,
                pedido.getFechaRegistro(),
                pedido.getFechaEntrega(),
                pedido.getPrioridad(),
                pedido.getEstado() != null ? pedido.getEstado().name() : null,
                ordenes,
                kits
        );
    }

    private PedidoOrdenResponse toResponse(Orden orden) {
        return new PedidoOrdenResponse(
                orden.getId(),
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

    private PedidoKitResponse toResponse(Kit kit) {
        return new PedidoKitResponse(
                kit.getId(),
                kit.getNombre(),
                kit.getDescripcion(),
                kit.getOrdenes().stream().map(Orden::getId).toList()
        );
    }
}
