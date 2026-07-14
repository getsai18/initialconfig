package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.cpm.backend.kernel.dto.PageResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.service.ClienteService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public PageResponse<ClienteResponse> findAll(@PageableDefault(size = 20, sort = "nombre") Pageable pageable,
                                                  @RequestParam(required = false) String q) {
        return PageResponse.of(clienteService.findAll(pageable, q));
    }

    @GetMapping("/{id}")
    public ClienteResponse findById(@PathVariable String id) {
        return clienteService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteResponse create(@RequestBody ClienteRequest request) {
        return clienteService.create(request);
    }

    @PutMapping("/{id}")
    public ClienteResponse update(@PathVariable String id, @RequestBody ClienteRequest request) {
        return clienteService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable String id) {
        clienteService.delete(id);
        return Map.of("deleted", true, "id", id);
    }

    /** Los datos reales de órdenes pertenecen al módulo de producción, que aún
     *  no existe. Se valida que el cliente exista y se devuelve una lista vacía
     *  respetando el contrato para que ese módulo la alimente después. */
    @GetMapping("/{id}/historial")
    public List<Object> historial(@PathVariable String id) {
        clienteService.findById(id);
        return List.of();
    }
}
