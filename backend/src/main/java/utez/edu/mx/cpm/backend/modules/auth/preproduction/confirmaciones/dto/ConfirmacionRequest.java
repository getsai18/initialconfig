package utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones.dto;

import jakarta.validation.constraints.NotBlank;

public record ConfirmacionRequest(
        @NotBlank String pedidoId,
        @NotBlank String ordenId,
        String equipo,
        String areaOrigen,
        String areaDestino,
        String solicitante,
        String validador,
        @NotBlank String tipo,
        String observaciones
) {
}
