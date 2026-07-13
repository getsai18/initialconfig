package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {
    private String usuario;
    private String nombre;
    private String email;
    private String password;
    private String role;
    private Long areaId;
    private String estado;
}

