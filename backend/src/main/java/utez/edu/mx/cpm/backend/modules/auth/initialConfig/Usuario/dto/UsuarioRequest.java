package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {
    @NotBlank(message = "El usuario es requerido.")
    @Size(min = 6, max = 12, message = "El usuario debe tener entre {min} y {max} caracteres.")
    private String usuario;
    @NotBlank(message = "El nombre es requerido.")
    @Size(max = 50, message = "El nombre no puede exceder {max} caracteres.")
    private String nombre;
    @NotBlank(message = "El email es requerido.")
    @Email(message = "El email no tiene un formato válido.")
    @Size(max = 100, message = "El email no puede exceder {max} caracteres.")
    private String email;
    // password es intencionalmente opcional: si no viene, el service genera una
    // temporal y la envía por correo (ver UsuarioServiceImpl.create).
    private String password;
    @NotBlank(message = "El rol es requerido.")
    private String role;
    private Long areaId;
    private String estado;
}
