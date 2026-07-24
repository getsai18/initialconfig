package utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto;

import jakarta.validation.constraints.NotBlank;

public record IncidenciaRequest(
        @NotBlank String pedidoId,
        @NotBlank String ordenId,
        String areaOrigen,
        String areaReporta,
        @NotBlank String descripcion,
        String acciones
) {
}
