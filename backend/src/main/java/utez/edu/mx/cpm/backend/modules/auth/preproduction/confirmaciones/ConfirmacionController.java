package utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.cpm.backend.kernel.dto.PageResponse;
import utez.edu.mx.cpm.backend.kernel.utils.ApiResponse;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones.dto.ConfirmacionRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones.dto.ConfirmacionResponse;

@RestController
@RequestMapping({"/confirmaciones", "/api/v1/confirmaciones"})
@RequiredArgsConstructor
public class ConfirmacionController {

    private final ConfirmacionService confirmacionService;

    @GetMapping
    public PageResponse<ConfirmacionResponse> findAll(@PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return PageResponse.of(confirmacionService.findAll(pageable));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse create(@Valid @RequestBody ConfirmacionRequest request) {
        return ApiResponse.success("Confirmación registrada correctamente", confirmacionService.create(request));
    }
}
