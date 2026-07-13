package com.cds.initialconfig.auth;

import jakarta.validation.constraints.NotBlank;

public record PasswordRecoveryRequest(
    @NotBlank(message = "usuario es requerido") String usuario,
    @NotBlank(message = "email es requerido") String email
) {}
