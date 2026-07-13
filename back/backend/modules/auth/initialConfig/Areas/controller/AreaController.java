package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.controller;

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
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto.AreaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.service.AreaService;

@RestController
@RequestMapping("/cpm-api/initial-config/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService areaService;

    @GetMapping
    public ResponseEntity<ApiResponse> findAll() {
        return ResponseEntity.ok(new ApiResponse("Áreas obtenidas correctamente.", areaService.findAll(), HttpStatus.OK));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse("Área obtenida correctamente.", areaService.findById(id), HttpStatus.OK));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody AreaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Área creada correctamente.", areaService.create(request), HttpStatus.CREATED));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody AreaRequest request) {
        return ResponseEntity.ok(new ApiResponse("Área actualizada correctamente.", areaService.update(id, request), HttpStatus.OK));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        areaService.delete(id);
        return ResponseEntity.ok(new ApiResponse("Área eliminada correctamente.", HttpStatus.OK));
    }
}

