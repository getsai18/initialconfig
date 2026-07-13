package com.cds.initialconfig.common.exception;

/** Credenciales inválidas, cuenta inactiva, OTP inválido/expirado o token de reset inválido. */
public class AuthException extends RuntimeException {
    public AuthException(String message) {
        super(message);
    }
}
