package com.cds.initialconfig.activity;

import java.util.List;

public record ActivityRequest(
    Long id,
    String nombre,
    TipoActividad tipo,
    List<String> opciones,
    List<String> etiquetas,
    String nota
) {}
