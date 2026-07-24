package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        String codigo,
        String clienteId,
        String clienteNombre,
        LocalDateTime fechaRegistro,
        LocalDate fechaEntrega,
        Boolean prioridad,
        String estado,
        List<PedidoOrdenResponse> ordenes,
        List<PedidoKitResponse> kits
) {
}
