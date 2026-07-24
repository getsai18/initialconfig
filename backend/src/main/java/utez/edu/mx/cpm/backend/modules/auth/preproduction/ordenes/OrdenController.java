package utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.dto.OrdenRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.dto.OrdenResponse;

@RestController
@RequestMapping({"/ordenes", "/api/v1/ordenes"})
@RequiredArgsConstructor
public class OrdenController {

    private final OrdenService ordenService;

    @GetMapping
    public PageResponse<OrdenResponse> findAll(@PageableDefault(size = 10, sort = "displayId") Pageable pageable,
                                               @RequestParam(required = false) String q) {
        return PageResponse.of(ordenService.findAll(pageable, q));
    }

    @GetMapping("/{id}")
    public ApiResponse findById(@PathVariable Long id) {
        return ApiResponse.success("Orden encontrada", ordenService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse create(@Valid @RequestBody OrdenRequest request) {
        return ApiResponse.success("Orden creada correctamente", ordenService.create(request));
    }

    @PutMapping("/{id}/avanzar-area")
    public ApiResponse avanzarArea(@PathVariable Long id) {
        return ApiResponse.success("Orden actualizada correctamente", ordenService.avanzarArea(id));
    }
}
