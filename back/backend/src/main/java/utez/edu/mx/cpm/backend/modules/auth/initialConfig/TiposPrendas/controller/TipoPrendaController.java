package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.controller;

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
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.service.TipoPrendaService;

import java.util.Map;

@RestController
@RequestMapping("/prendas")
@RequiredArgsConstructor
public class TipoPrendaController {

    private final TipoPrendaService tipoPrendaService;

    @GetMapping
    public PageResponse<TipoPrendaResponse> findAll(@PageableDefault(size = 20, sort = "nombre") Pageable pageable,
                                                     @RequestParam(required = false) String q) {
        return PageResponse.of(tipoPrendaService.findAll(pageable, q));
    }

    @GetMapping("/{id}")
    public TipoPrendaResponse findById(@PathVariable Long id) {
        return tipoPrendaService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoPrendaResponse create(@RequestBody TipoPrendaRequest request) {
        return tipoPrendaService.create(request);
    }

    @PutMapping("/{id}")
    public TipoPrendaResponse update(@PathVariable Long id, @RequestBody TipoPrendaRequest request) {
        return tipoPrendaService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        tipoPrendaService.delete(id);
        return Map.of("deleted", true, "id", id);
    }
}
