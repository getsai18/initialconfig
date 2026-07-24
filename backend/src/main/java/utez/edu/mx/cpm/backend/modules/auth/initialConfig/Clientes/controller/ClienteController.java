package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.controller;

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
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.service.ClienteService;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.PedidoRepository;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoResponse;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping({"/clientes", "/api/v1/clientes"})
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;
    private final PedidoRepository pedidoRepository;

    @GetMapping
    public PageResponse<ClienteResponse> findAll(@PageableDefault(size = 20, sort = "nombre") Pageable pageable,
                                                  @RequestParam(required = false) String q) {
        return PageResponse.of(clienteService.findAll(pageable, q));
    }

    @GetMapping("/{id}")
    public ApiResponse findById(@PathVariable String id) {
        return ApiResponse.success("Cliente encontrado", clienteService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse create(@Valid @RequestBody ClienteRequest request) {
        return ApiResponse.success("Cliente creado correctamente", clienteService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse update(@PathVariable String id, @Valid @RequestBody ClienteRequest request) {
        return ApiResponse.success("Cliente actualizado correctamente", clienteService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable String id) {
        clienteService.delete(id);
        return ApiResponse.success("Cliente eliminado correctamente", Map.of("deleted", true, "id", id));
    }

    @GetMapping("/{id}/historial")
    public ApiResponse historial(@PathVariable String id) {
        List<PedidoResponse> historial = pedidoRepository.findByCliente_IdOrderByFechaRegistroDesc(id)
                .stream()
                .map(pedido -> new PedidoResponse(
                        pedido.getId(),
                        pedido.getCodigo(),
                        pedido.getCliente() != null ? pedido.getCliente().getId() : null,
                        pedido.getCliente() != null ? pedido.getCliente().getNombre() : null,
                        pedido.getFechaRegistro(),
                        pedido.getFechaEntrega(),
                        pedido.getPrioridad(),
                        pedido.getEstado() != null ? pedido.getEstado().name() : null,
                        List.of(),
                        List.of()
                ))
                .toList();
        return ApiResponse.success("Historial del cliente", historial);
    }

    // GET /clientes/{id}/historial y GET /clientes/resumen ahora los sirve
    // ClienteResumenController (módulo preproduction), con datos reales de Pedido.
}
