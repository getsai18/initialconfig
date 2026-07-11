package com.cds.initialconfig.dashboard.dto;

public record StatsResponse(
    int pendientes,
    int enProgreso,
    int enEspera,
    int incidencias
) {}
