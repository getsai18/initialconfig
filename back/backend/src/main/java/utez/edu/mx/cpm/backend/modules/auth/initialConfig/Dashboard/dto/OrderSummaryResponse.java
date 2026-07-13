package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.dto;

import java.time.LocalDate;

/** status: "pendiente" | "en-progreso" | "en-espera" | "completado". */
public record OrderSummaryResponse(
        String id,
        LocalDate registeredDate,
        LocalDate deliveryDate,
        String clientName,
        String status
) {
}
