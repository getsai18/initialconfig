package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.controller;

import jakarta.validation.Valid;
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
import utez.edu.mx.cpm.backend.kernel.utils.ApiResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto.ActividadCatalogoRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto.ActividadCatalogoResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.service.ActividadCatalogoService;

import java.util.Map;

@RestController
@RequestMapping({"/activities", "/api/v1/actividades"})
@RequiredArgsConstructor
public class ActividadCatalogoController {

    private final ActividadCatalogoService actividadCatalogoService;

    @GetMapping
    public PageResponse<ActividadCatalogoResponse> findAll(@PageableDefault(size = 20, sort = "nombre") Pageable pageable,
                                                           @RequestParam(required = false) String q) {
        return PageResponse.of(actividadCatalogoService.findAll(pageable, q));
    }

    @GetMapping("/{id}")
    public ApiResponse findById(@PathVariable Long id) {
        return ApiResponse.success("Actividad encontrada", actividadCatalogoService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse create(@Valid @RequestBody ActividadCatalogoRequest request) {
        return ApiResponse.success("Actividad creada correctamente", actividadCatalogoService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse update(@PathVariable Long id, @Valid @RequestBody ActividadCatalogoRequest request) {
        return ApiResponse.success("Actividad actualizada correctamente", actividadCatalogoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable Long id) {
        actividadCatalogoService.delete(id);
        return ApiResponse.success("Actividad eliminada correctamente", Map.of("deleted", true, "id", id));
    }
}
