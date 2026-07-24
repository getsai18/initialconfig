package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActividadCatalogoRequest {
    @NotBlank(message = "El nombre de la actividad es requerido.")
    private String nombre;
    @NotBlank(message = "El tipo de la actividad es requerido.")
    private String tipo;
    private List<String> opciones;
    private List<String> etiquetas;
    private String nota;
}

