package com.cds.initialconfig.dashboard.dto;

import java.time.LocalDate;

/** status: "pendiente" | "en-progreso" | "en-espera" | "completado".
 *  Campos deliveryDate/clientName tomados del consumidor real (OrdersTable.jsx),
 *  que difieren de la abreviatura "del" del mensaje original del usuario. */
public record OrderSummaryResponse(
    String id,
    LocalDate registeredDate,
    LocalDate deliveryDate,
    String clientName,
    String status
) {}
