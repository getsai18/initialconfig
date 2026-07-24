package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto;

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
public class AreaRequest {
    @NotBlank(message = "El nombre del área es requerido.")
    @Size(max = 50, message = "El nombre del área no puede exceder {max} caracteres.")
    private String nombre;
    private Integer ordenSecuencia;
    private Boolean activa;
    @Size(max = 500, message = "La descripción del área no puede exceder {max} caracteres.")
    private String descripcion;
    // estado ya no se acepta del cliente: se recalcula automáticamente según
    // los usuarios activos asignados al área (ver AreaServiceImpl).
    private String estado;
}
