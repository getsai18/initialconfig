package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.controller;

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
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.service.TipoPrendaService;

@RestController
@RequestMapping("/cpm-api/initial-config/tipos-prendas")
@RequiredArgsConstructor
public class TipoPrendaController {

    private final TipoPrendaService tipoPrendaService;

    @GetMapping
    public ResponseEntity<ApiResponse> findAll() {
        return ResponseEntity.ok(new ApiResponse("Tipos de prendas obtenidos correctamente.", tipoPrendaService.findAll(), HttpStatus.OK));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse("Tipo de prenda obtenido correctamente.", tipoPrendaService.findById(id), HttpStatus.OK));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody TipoPrendaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Tipo de prenda creado correctamente.", tipoPrendaService.create(request), HttpStatus.CREATED));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody TipoPrendaRequest request) {
        return ResponseEntity.ok(new ApiResponse("Tipo de prenda actualizado correctamente.", tipoPrendaService.update(id, request), HttpStatus.OK));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        tipoPrendaService.delete(id);
        return ResponseEntity.ok(new ApiResponse("Tipo de prenda eliminado correctamente.", HttpStatus.OK));
    }
}

