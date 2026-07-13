package utez.edu.mx.cpm.backend.modules.auth.login.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.cpm.backend.kernel.utils.ApiResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginRequest;
import utez.edu.mx.cpm.backend.modules.auth.exceptions.AuthException;
import utez.edu.mx.cpm.backend.modules.auth.login.service.AuthService;

@RestController
@RequestMapping("/cpm-api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(
                    new ApiResponse("Inicio de sesión exitoso.", authService.login(request), HttpStatus.OK)
            );
        } catch (AuthException exception) {
            return ResponseEntity.status(exception.getStatus())
                    .body(new ApiResponse(exception.getMessage(), null, true, exception.getStatus()));
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("No fue posible iniciar sesión.", null, true, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
}

