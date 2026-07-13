package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.dto;

public record StatsResponse(
        int pendientes,
        int enProgreso,
        int enEspera,
        int incidencias
) {
}
