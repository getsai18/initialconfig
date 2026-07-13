package com.cds.initialconfig.auth;

import jakarta.validation.constraints.NotBlank;

public record PasswordResetRequest(
    @NotBlank(message = "resetToken es requerido") String resetToken,
    @NotBlank(message = "nuevaPassword es requerido") String nuevaPassword
) {}
