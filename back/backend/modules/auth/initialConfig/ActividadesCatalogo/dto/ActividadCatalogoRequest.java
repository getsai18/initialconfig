package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActividadCatalogoRequest {
    private String nombre;
    private String tipo;
    private String opciones;
    private String etiquetas;
    private String nota;
}

