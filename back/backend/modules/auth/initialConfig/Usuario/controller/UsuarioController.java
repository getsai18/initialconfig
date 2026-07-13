package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.controller;

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
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.service.UsuarioService;

@RestController
@RequestMapping("/cpm-api/initial-config/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<ApiResponse> findAll() {
        return ResponseEntity.ok(new ApiResponse("Usuarios obtenidos correctamente.", usuarioService.findAll(), HttpStatus.OK));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse("Usuario obtenido correctamente.", usuarioService.findById(id), HttpStatus.OK));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody UsuarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Usuario creado correctamente.", usuarioService.create(request), HttpStatus.CREATED));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(new ApiResponse("Usuario actualizado correctamente.", usuarioService.update(id, request), HttpStatus.OK));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.ok(new ApiResponse("Usuario eliminado correctamente.", HttpStatus.OK));
    }
}

