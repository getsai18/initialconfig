package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.dto;

import java.time.LocalDate;

/** status: el valor real de Orden.status — "En progreso" | "En producción" | "Terminado"
 *  (ver Pedido.EN_PROGRESO/EN_PRODUCCION/TERMINADO), no un vocabulario aparte. */
public record OrderSummaryResponse(
        String id,
        LocalDate registeredDate,
        LocalDate deliveryDate,
        String clientName,
        String status
) {
}
