package com.cds.initialconfig.cliente;

import com.cds.initialconfig.cliente.dto.OrdenHistorialResponse;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Cliente> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Cliente findById(@PathVariable String id) {
        return service.findByIdOrThrow(id);
    }

    @PostMapping
    public Cliente create(@RequestBody ClienteRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public Cliente update(@PathVariable String id, @RequestBody ClienteRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable String id) {
        service.delete(id);
        return Map.of("deleted", true, "id", id);
    }

    /** Los datos reales de órdenes pertenecen al módulo de producción, que aún
     *  no existe. Se valida que el cliente exista y se devuelve una lista vacía
     *  respetando el contrato para que ese módulo la alimente después. */
    @GetMapping("/{id}/historial")
    public List<OrdenHistorialResponse> historial(@PathVariable String id) {
        service.findByIdOrThrow(id);
        return List.of();
    }
}
