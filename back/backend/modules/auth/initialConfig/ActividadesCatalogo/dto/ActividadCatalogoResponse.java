package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActividadCatalogoResponse {
    private Long id;
    private String nombre;
    private String tipo;
    private String opciones;
    private String etiquetas;
    private String nota;
    private LocalDateTime fechaCreacion;
}

