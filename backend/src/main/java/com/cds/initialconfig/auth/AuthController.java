package com.cds.initialconfig.auth;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return service.login(req);
    }

    @PostMapping("/password-recovery/request")
    public Map<String, Object> requestPasswordRecovery(@Valid @RequestBody PasswordRecoveryRequest req) {
        service.requestPasswordRecovery(req);
        return Map.of("sent", true);
    }

    @PostMapping("/password-recovery/verify")
    public PasswordRecoveryVerifyResponse verifyPasswordRecovery(@Valid @RequestBody PasswordRecoveryVerifyRequest req) {
        return service.verifyOtp(req);
    }

    @PostMapping("/password-recovery/reset")
    public Map<String, Object> resetPassword(@Valid @RequestBody PasswordResetRequest req) {
        service.resetPassword(req);
        return Map.of("reset", true);
    }
}
