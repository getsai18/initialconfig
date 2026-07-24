package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto;

import jakarta.validation.constraints.NotBlank;

public record PedidoKitRequest(
        @NotBlank(message = "El nombre del kit es requerido.") String nombre,
        String descripcion
) {
}
