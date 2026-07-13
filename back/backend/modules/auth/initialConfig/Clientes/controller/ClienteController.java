package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.cpm.backend.kernel.utils.ApiResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.service.ClienteService;

@RestController
@RequestMapping("/cpm-api/initial-config/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public ResponseEntity<ApiResponse> findAll() {
        return ResponseEntity.ok(new ApiResponse("Clientes obtenidos correctamente.", clienteService.findAll(), HttpStatus.OK));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(new ApiResponse("Cliente obtenido correctamente.", clienteService.findById(id), HttpStatus.OK));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody ClienteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Cliente creado correctamente.", clienteService.create(request), HttpStatus.CREATED));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable String id, @RequestBody ClienteRequest request) {
        return ResponseEntity.ok(new ApiResponse("Cliente actualizado correctamente.", clienteService.update(id, request), HttpStatus.OK));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable String id) {
        clienteService.delete(id);
        return ResponseEntity.ok(new ApiResponse("Cliente eliminado correctamente.", HttpStatus.OK));
    }
}

