package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos;

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
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoResponse;

import java.util.Map;

@RestController
@RequestMapping({"/pedidos", "/api/v1/pedidos"})
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    public PageResponse<PedidoResponse> findAll(@PageableDefault(size = 10, sort = "fechaRegistro") Pageable pageable,
                                                @RequestParam(required = false) String q) {
        return PageResponse.of(pedidoService.findAll(pageable, q));
    }

    @GetMapping("/{id}")
    public ApiResponse findById(@PathVariable Long id) {
        return ApiResponse.success("Pedido encontrado", pedidoService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse create(@Valid @RequestBody PedidoRequest request) {
        return ApiResponse.success("Pedido creado correctamente", pedidoService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse update(@PathVariable Long id, @Valid @RequestBody PedidoRequest request) {
        return ApiResponse.success("Pedido actualizado correctamente", pedidoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable Long id) {
        return ApiResponse.failure("La eliminación de pedidos no está habilitada.", Map.of("id", id));
    }
}
