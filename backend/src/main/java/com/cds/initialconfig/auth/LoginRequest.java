package com.cds.initialconfig.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "usuario es requerido") String usuario,
    @NotBlank(message = "password es requerido") String password
) {}
