package utez.edu.mx.cpm.backend.modules.auth.login.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryVerifyRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryVerifyResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordResetRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/password-recovery/request")
    public Map<String, Object> requestPasswordRecovery(@RequestBody PasswordRecoveryRequest request) {
        authService.requestPasswordRecovery(request);
        return Map.of("sent", true);
    }

    @PostMapping("/password-recovery/verify")
    public PasswordRecoveryVerifyResponse verifyPasswordRecovery(@RequestBody PasswordRecoveryVerifyRequest request) {
        return authService.verifyOtp(request);
    }

    @PostMapping("/password-recovery/reset")
    public Map<String, Object> resetPassword(@RequestBody PasswordResetRequest request) {
        authService.resetPassword(request);
        return Map.of("reset", true);
    }
}
