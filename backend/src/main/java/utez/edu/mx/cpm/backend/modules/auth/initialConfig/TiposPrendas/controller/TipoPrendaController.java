package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.controller;

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
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.service.TipoPrendaService;

import java.util.Map;

@RestController
@RequestMapping({"/prendas", "/api/v1/prendas"})
@RequiredArgsConstructor
public class TipoPrendaController {

    private final TipoPrendaService tipoPrendaService;

    @GetMapping
    public PageResponse<TipoPrendaResponse> findAll(@PageableDefault(size = 20, sort = "nombre") Pageable pageable,
                                                    @RequestParam(required = false) String q) {
        return PageResponse.of(tipoPrendaService.findAll(pageable, q));
    }

    @GetMapping("/{id}")
    public ApiResponse findById(@PathVariable Long id) {
        return ApiResponse.success("Prenda encontrada", tipoPrendaService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse create(@Valid @RequestBody TipoPrendaRequest request) {
        return ApiResponse.success("Prenda creada correctamente", tipoPrendaService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse update(@PathVariable Long id, @Valid @RequestBody TipoPrendaRequest request) {
        return ApiResponse.success("Prenda actualizada correctamente", tipoPrendaService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable Long id) {
        tipoPrendaService.delete(id);
        return ApiResponse.success("Prenda eliminada correctamente", Map.of("deleted", true, "id", id));
    }
}
