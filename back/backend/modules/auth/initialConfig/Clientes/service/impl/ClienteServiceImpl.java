package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.Cliente;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.ClienteRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteServiceImpl implements utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.service.ClienteService {

    private final ClienteRepository clienteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponse> findAll() {
        return clienteRepository.findAll().stream().map(this::toResponse).toList();
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
                .build();
        return toResponse(clienteRepository.save(cliente));
    }

    @Override
    public ClienteResponse update(String id, ClienteRequest request) {
        Cliente cliente = findEntity(id);
        cliente.setNombre(required(request.getNombre(), "El nombre del cliente es requerido."));
        cliente.setVendor(normalizeOptional(request.getVendor()));
        cliente.setInformacion(normalizeOptional(request.getInformacion()));
        cliente.setFechaRegistro(parseDate(request.getFechaRegistro()));
        return toResponse(clienteRepository.save(cliente));
    }

    @Override
    public void delete(String id) {
        clienteRepository.delete(findEntity(id));
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
                .build();
    }
}

