package utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto;

import java.time.LocalDateTime;

public record IncidenciaResponse(
        Long id,
        String pedidoId,
        String ordenId,
        String areaOrigen,
        String areaReporta,
        String descripcion,
        String acciones,
        String estado,
        LocalDateTime fechaReporte,
        String personaValida
) {
}
