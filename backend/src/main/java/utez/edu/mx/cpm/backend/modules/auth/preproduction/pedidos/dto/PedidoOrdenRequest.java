package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record PedidoOrdenRequest(
        @NotBlank(message = "La disciplina es requerida.") String disciplina,
        String tipoDiseno,
        String calidadMaterial,
        String tipoUniforme,
        List<String> prendas,
        List<Long> secuenciaAreas
) {
}
