package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.controller;

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
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto.ActividadCatalogoRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.service.ActividadCatalogoService;

@RestController
@RequestMapping("/cpm-api/initial-config/actividades")
@RequiredArgsConstructor
public class ActividadCatalogoController {

    private final ActividadCatalogoService actividadCatalogoService;

    @GetMapping
    public ResponseEntity<ApiResponse> findAll() {
        return ResponseEntity.ok(new ApiResponse("Actividades obtenidas correctamente.", actividadCatalogoService.findAll(), HttpStatus.OK));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse("Actividad obtenida correctamente.", actividadCatalogoService.findById(id), HttpStatus.OK));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody ActividadCatalogoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Actividad creada correctamente.", actividadCatalogoService.create(request), HttpStatus.CREATED));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody ActividadCatalogoRequest request) {
        return ResponseEntity.ok(new ApiResponse("Actividad actualizada correctamente.", actividadCatalogoService.update(id, request), HttpStatus.OK));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        actividadCatalogoService.delete(id);
        return ResponseEntity.ok(new ApiResponse("Actividad eliminada correctamente.", HttpStatus.OK));
    }
}

