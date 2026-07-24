package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.Cliente;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.ClienteRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteResponse;
// import utez.edu.mx.cpm.backend.modules.auth.preproduction.Pedidos.PedidoRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteServiceImpl implements utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.service.ClienteService {

    private final ClienteRepository clienteRepository;
    // private final PedidoRepository pedidoRepository;

    private static final String ESTADO_ACTIVO = "activo";
    private static final String ESTADO_ELIMINADO = "eliminado";

    @Override
    @Transactional(readOnly = true)
    public Page<ClienteResponse> findAll(Pageable pageable, String q) {
        if (q == null || q.isBlank()) {
            return clienteRepository.findByEstado(ESTADO_ACTIVO, pageable).map(this::toResponse);
        }
        String term = q.trim();
        return clienteRepository.searchByEstado(ESTADO_ACTIVO, term, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponse findById(String id) {
        return toResponse(findEntity(id));
    }

    @Override
    public ClienteResponse create(ClienteRequest request) {
        String id = request.getId() == null || request.getId().isBlank() ? UUID.randomUUID().toString() : request.getId().trim();
        if (clienteRepository.existsById(id)) {
            throw new AppException(HttpStatus.CONFLICT, "Ya existe un cliente con ese identificador.");
        }
        Cliente cliente = Cliente.builder()
                .id(id)
                .nombre(required(request.getNombre(), "El nombre del cliente es requerido."))
                .vendor(normalizeOptional(request.getVendor()))
                .informacion(normalizeOptional(request.getInformacion()))
                .fechaRegistro(parseDate(request.getFechaRegistro()))
                .fechaCreacion(LocalDateTime.now())
                .activo(Boolean.TRUE)
                .estado(ESTADO_ACTIVO)
                .build();
        return toResponse(clienteRepository.save(cliente));
    }

    @Override
    public ClienteResponse update(String id, ClienteRequest request) {
        Cliente cliente = findEntity(id);
        cliente.setNombre(required(request.getNombre(), "El nombre del cliente es requerido."));
        cliente.setVendor(normalizeOptional(request.getVendor()));
        cliente.setInformacion(normalizeOptional(request.getInformacion()));
        if (request.getFechaRegistro() != null && !request.getFechaRegistro().isBlank()) {
            cliente.setFechaRegistro(parseDate(request.getFechaRegistro()));
        }
        cliente.setActivo(Boolean.TRUE);
        cliente.setEstado(ESTADO_ACTIVO);
        return toResponse(clienteRepository.save(cliente));
    }

    /**
     * Borrado lógico: el cliente deja de listarse/asignarse, pero la fila se
     * conserva para no perder el historial de pedidos que lo referencian.
     */
    @Override
    public void delete(String id) {
        Cliente cliente = findEntity(id);
        if (ESTADO_ELIMINADO.equals(cliente.getEstado())) {
            throw new AppException(HttpStatus.CONFLICT, "El cliente ya fue eliminado.");
        }
        cliente.setEstado(ESTADO_ELIMINADO);
        cliente.setActivo(Boolean.FALSE);
        clienteRepository.save(cliente);
    }

    private Cliente findEntity(String id) {
        if (id == null || id.isBlank()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El identificador del cliente es requerido.");
        }
        return clienteRepository.findById(id.trim())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Cliente no encontrado."));
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

    private LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "La fecha de registro es requerida.");
        }
        try {
            return LocalDate.parse(value.trim());
        } catch (Exception exception) {
            throw new AppException(HttpStatus.BAD_REQUEST, "La fecha de registro debe tener formato YYYY-MM-DD.");
        }
    }

    private ClienteResponse toResponse(Cliente cliente) {
        return ClienteResponse.builder()
                .id(cliente.getId())
                .nombre(cliente.getNombre())
                .vendor(cliente.getVendor())
                .informacion(cliente.getInformacion())
                .fechaRegistro(cliente.getFechaRegistro())
                .fechaCreacion(cliente.getFechaCreacion())
                .activo(cliente.getActivo())
                .estado(cliente.getEstado())
                .build();
    }
}
