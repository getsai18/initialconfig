package utez.edu.mx.cpm.backend.modules.auth.login.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String usuario;
    private String nombre;
    private String email;
    private String rol;
    private Long areaId;
    private String areaNombre;
    private String token;
}

