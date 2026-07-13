package com.cds.initialconfig.auth;

import jakarta.validation.constraints.NotBlank;

public record PasswordRecoveryVerifyRequest(
    @NotBlank(message = "usuario es requerido") String usuario,
    @NotBlank(message = "otpCode es requerido") String otpCode
) {}
