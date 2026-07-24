package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String usuario;
    private String nombre;
    private String email;
    private String role;
    private Long areaId;
    private String areaNombre;
    private Boolean activo;
    private String estado;
    private LocalDateTime fechaCreacion;
}
