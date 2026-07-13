package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoPrendaResponse {
    private Long id;
    private String nombre;
    private String categoria;
    private String icono;
    private String tallasDisponibles;
    private LocalDateTime fechaCreacion;
}

