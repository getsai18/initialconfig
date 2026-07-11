package com.cds.initialconfig.prenda;

public record PrendaRequest(
    Long id,
    String nombre,
    IconoPrenda icono
) {}
