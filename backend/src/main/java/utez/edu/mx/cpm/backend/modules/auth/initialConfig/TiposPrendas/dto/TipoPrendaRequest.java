package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoPrendaRequest {
    @NotBlank(message = "El nombre de la prenda es requerido.")
    private String nombre;
    // categoria/icono no se marcan @NotBlank aquí: el service (resolveCategoria)
    // acepta que solo venga icono y lo usa como categoría; ahí también se valida
    // contra la lista fija de categorías/iconos válidos.
    private String categoria;
    private String icono;
    private String tallasDisponibles;
}

