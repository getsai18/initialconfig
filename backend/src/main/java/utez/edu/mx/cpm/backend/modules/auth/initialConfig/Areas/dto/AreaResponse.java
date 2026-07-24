package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AreaResponse {
    private Long id;
    private String nombre;
    private Integer ordenSecuencia;
    private Boolean activa;
    private String descripcion;
    private String estado;
    private LocalDateTime fechaCreacion;
}
