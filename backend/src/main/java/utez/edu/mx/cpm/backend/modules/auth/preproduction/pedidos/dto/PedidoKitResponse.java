package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto;

import java.util.List;

public record PedidoKitResponse(
        Long id,
        String nombre,
        String descripcion,
        List<Long> ordenesIds
) {
}
