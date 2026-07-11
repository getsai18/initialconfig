package com.cds.initialconfig.cliente;

public record ClienteRequest(
    String id,
    String nombre,
    String vendor,
    String informacion
) {}
