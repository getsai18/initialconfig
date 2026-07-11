package com.cds.initialconfig.area;

/** Se usa tanto para crear como para actualizar (merge): en update, un campo en
 *  null significa "no lo toques", no "bórralo". */
public record AreaRequest(
    Long id,
    String nombre,
    String descripcion,
    EstadoArea estado
) {}
