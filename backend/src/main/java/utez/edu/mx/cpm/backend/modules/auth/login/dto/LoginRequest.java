package utez.edu.mx.cpm.backend.modules.auth.login.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "El usuario es requerido.")
    private String usuario;
    @NotBlank(message = "La contraseña es requerida.")
    private String password;
}

