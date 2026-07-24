package utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrdenRequest(
        @NotNull(message = "El pedido es requerido.") Long pedidoId,
        String disciplina,
        String tipoDiseno,
        String calidadMaterial,
        String tipoUniforme,
        List<String> prendas,
        List<Long> secuenciaAreas
) {
}
