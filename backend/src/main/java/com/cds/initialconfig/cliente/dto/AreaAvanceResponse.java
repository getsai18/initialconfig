package com.cds.initialconfig.cliente.dto;

/** Avance de una orden por área. El módulo de producción (aún no existe)
 *  es quien realmente llenará esta estructura; por ahora solo se documenta
 *  el contrato para que /clientes/{id}/historial lo respete. */
public record AreaAvanceResponse(
    String nombre,
    String color,
    int done,
    int total,
    boolean isAreaConfirmed
) {}
