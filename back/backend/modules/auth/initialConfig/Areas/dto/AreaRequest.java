package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AreaRequest {
    private String nombre;
    private String descripcion;
    private String estado;
}

