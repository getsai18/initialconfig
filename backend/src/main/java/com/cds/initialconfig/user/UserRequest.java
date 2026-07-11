package com.cds.initialconfig.user;

/** Solo para creación (POST). Las actualizaciones (PUT) llegan como un mapa
 *  crudo porque el frontend a veces manda el formulario completo y a veces
 *  solo {"password": "..."} durante el flujo de recuperación de contraseña. */
public record UserRequest(
    Long id,
    String usuario,
    String nombre,
    String email,
    String password,
    Role role,
    Long areaId,
    EstadoUsuario estado
) {}
