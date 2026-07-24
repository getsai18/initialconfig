package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.dto;

/**
 * enProgreso/enProduccion/terminadas se derivan directamente del vocabulario
 * real de Orden.status / Pedido.status ("En progreso" | "En producción" |
 * "Terminado", ver Pedido.EN_PROGRESO/EN_PRODUCCION/TERMINADO).
 * incidencias se mantiene fijo en 0 a propósito: no existe módulo de
 * Incidencias en este backend todavía — el campo queda reservado para cuando
 * se implemente, en vez de inventar un conteo sin datos reales detrás.
 */
public record StatsResponse(
        int enProgreso,
        int enProduccion,
        int terminadas,
        int incidencias
) {
}
