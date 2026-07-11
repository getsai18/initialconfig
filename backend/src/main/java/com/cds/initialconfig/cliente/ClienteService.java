package com.cds.initialconfig.cliente;

import com.cds.initialconfig.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> findAll() {
        return repository.findAll();
    }

    public Cliente findByIdOrThrow(String id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + id));
    }

    public Cliente create(ClienteRequest req) {
        if (req.nombre() == null || req.nombre().isBlank()) throw new IllegalArgumentException("nombre es requerido");
        if (req.informacion() != null && req.informacion().length() > 300) {
            throw new IllegalArgumentException("informacion máximo 300 caracteres");
        }

        String id = (req.id() != null && !req.id().isBlank()) ? req.id() : UUID.randomUUID().toString();

        Cliente cliente = Cliente.builder()
            .id(id)
            .nombre(req.nombre())
            .vendor(req.vendor())
            .informacion(req.informacion())
            .fechaRegistro(LocalDate.now())
            .build();
        return repository.save(cliente);
    }

    public Cliente update(String id, ClienteRequest req) {
        Cliente cliente = findByIdOrThrow(id);

        if (req.nombre() != null) {
            if (req.nombre().isBlank()) throw new IllegalArgumentException("nombre no puede estar vacío");
            cliente.setNombre(req.nombre());
        }
        if (req.vendor() != null) cliente.setVendor(req.vendor());
        if (req.informacion() != null) {
            if (req.informacion().length() > 300) throw new IllegalArgumentException("informacion máximo 300 caracteres");
            cliente.setInformacion(req.informacion());
        }

        return repository.save(cliente);
    }

    public void delete(String id) {
        Cliente cliente = findByIdOrThrow(id);
        repository.delete(cliente);
    }
}
