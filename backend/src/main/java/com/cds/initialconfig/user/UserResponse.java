package com.cds.initialconfig.user;

import java.time.LocalDate;

/** Nunca incluye password. */
public record UserResponse(
    Long id,
    String usuario,
    String nombre,
    String email,
    Role role,
    Long areaId,
    EstadoUsuario estado,
    LocalDate fechaCreacion
) {
    public static UserResponse from(Usuario u) {
        return new UserResponse(
            u.getId(), u.getUsuario(), u.getNombre(), u.getEmail(),
            u.getRole(), u.getAreaId(), u.getEstado(), u.getFechaCreacion()
        );
    }
}
