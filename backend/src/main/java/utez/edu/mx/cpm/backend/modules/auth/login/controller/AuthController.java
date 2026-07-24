package utez.edu.mx.cpm.backend.modules.auth.login.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.cpm.backend.kernel.utils.ApiResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryVerifyRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryVerifyResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordResetRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping({"/auth", "/api/v1/auth"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ApiResponse.success("Inicio de sesión correcto", response);
    }

    @PostMapping({"/password-recovery/request", "/recovery/request"})
    public ApiResponse requestPasswordRecovery(@RequestBody PasswordRecoveryRequest request) {
        authService.requestPasswordRecovery(request);
        return ApiResponse.success("Solicitud de recuperación enviada", Map.of("sent", true));
    }

    @PostMapping({"/password-recovery/verify", "/recovery/verify"})
    public ApiResponse verifyPasswordRecovery(@RequestBody PasswordRecoveryVerifyRequest request) {
        PasswordRecoveryVerifyResponse response = authService.verifyOtp(request);
        return ApiResponse.success("Código verificado correctamente", response);
    }

    @PostMapping({"/password-recovery/reset", "/recovery/reset"})
    public ApiResponse resetPassword(@RequestBody PasswordResetRequest request) {
        authService.resetPassword(request);
        return ApiResponse.success("Contraseña restablecida correctamente", Map.of("reset", true));
    }
}
