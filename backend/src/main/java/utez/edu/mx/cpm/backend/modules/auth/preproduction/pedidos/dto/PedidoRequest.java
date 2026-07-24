package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PedidoRequest(
        @NotNull(message = "El cliente es requerido.") String clienteId,
        @NotNull(message = "La fecha de entrega es requerida.") String fechaEntrega,
        Boolean prioridad,
        String estado,
        @Valid List<PedidoOrdenRequest> ordenes,
        @Valid List<PedidoKitRequest> kits
) {
}
