package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto;

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
    private String nombre;
    private String tipo;
    private List<String> opciones;
    private List<String> etiquetas;
    private String nota;
}

