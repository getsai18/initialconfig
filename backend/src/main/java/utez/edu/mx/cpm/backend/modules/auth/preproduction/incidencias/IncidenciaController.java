package utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias;

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
import utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto.IncidenciaRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto.IncidenciaResolverRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto.IncidenciaResponse;

@RestController
@RequestMapping({"/incidencias", "/api/v1/incidencias"})
@RequiredArgsConstructor
public class IncidenciaController {

    private final IncidenciaService incidenciaService;

    @GetMapping
    public PageResponse<IncidenciaResponse> findAll(@PageableDefault(size = 10, sort = "fechaReporte") Pageable pageable,
                                                    @RequestParam(required = false) String estado) {
        return PageResponse.of(incidenciaService.findAll(pageable, estado));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse create(@Valid @RequestBody IncidenciaRequest request) {
        return ApiResponse.success("Incidencia registrada correctamente", incidenciaService.create(request));
    }

    @PutMapping("/{id}/resolver")
    public ApiResponse resolver(@PathVariable Long id, @RequestBody(required = false) IncidenciaResolverRequest request) {
        return ApiResponse.success("Incidencia resuelta correctamente", incidenciaService.resolver(id, request));
    }
}
