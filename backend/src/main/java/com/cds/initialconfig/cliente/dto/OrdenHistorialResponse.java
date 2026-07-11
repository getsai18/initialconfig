package com.cds.initialconfig.cliente.dto;

import java.time.LocalDate;
import java.util.List;

/** estado: "completado" | "en-progreso" | "pendiente" | "cancelado".
 *  progreso solo es relevante si estado="en-progreso".
 *  Depende del módulo de producción (aún no existe); por ahora
 *  GET /clientes/{id}/historial siempre devuelve una lista vacía. */
public record OrdenHistorialResponse(
    String id,
    String descripcion,
    LocalDate fecha,
    LocalDate entrega,
    String estado,
    Integer progreso,
    List<AreaAvanceResponse> areas
) {}
