package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoPrendaRequest {
    private String nombre;
    private String categoria;
    private String icono;
    private String tallasDisponibles;
}

