package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.controller;

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
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto.AreaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto.AreaResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.service.AreaService;

import java.util.Map;

@RestController
@RequestMapping("/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService areaService;

    @GetMapping
    public PageResponse<AreaResponse> findAll(@PageableDefault(size = 20, sort = "nombre") Pageable pageable,
                                               @RequestParam(required = false) String q) {
        return PageResponse.of(areaService.findAll(pageable, q));
    }

    @GetMapping("/{id}")
    public AreaResponse findById(@PathVariable Long id) {
        return areaService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AreaResponse create(@RequestBody AreaRequest request) {
        return areaService.create(request);
    }

    @PutMapping("/{id}")
    public AreaResponse update(@PathVariable Long id, @RequestBody AreaRequest request) {
        return areaService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        areaService.delete(id);
        return Map.of("deleted", true, "id", id);
    }
}
