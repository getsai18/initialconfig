package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.controller;

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
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.service.UsuarioService;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public PageResponse<UsuarioResponse> findAll(@PageableDefault(size = 20, sort = "nombre") Pageable pageable,
                                                  @RequestParam(required = false) String q) {
        return PageResponse.of(usuarioService.findAll(pageable, q));
    }

    @GetMapping("/{id}")
    public UsuarioResponse findById(@PathVariable Long id) {
        return usuarioService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse create(@RequestBody UsuarioRequest request) {
        return usuarioService.create(request);
    }

    @PutMapping("/{id}")
    public UsuarioResponse update(@PathVariable Long id, @RequestBody UsuarioRequest request) {
        return usuarioService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return Map.of("deleted", true, "id", id);
    }
}
