package utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones.dto;

import java.time.LocalDateTime;

public record ConfirmacionResponse(
        Long id,
        String pedidoId,
        String ordenId,
        String equipo,
        String areaOrigen,
        String areaDestino,
        String solicitante,
        String validador,
        String tipo,
        LocalDateTime fecha,
        String observaciones
) {
}
