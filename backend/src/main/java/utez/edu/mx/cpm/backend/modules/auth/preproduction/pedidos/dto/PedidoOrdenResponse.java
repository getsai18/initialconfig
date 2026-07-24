package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto;

import java.util.List;

public record PedidoOrdenResponse(
        Long id,
        String internalCode,
        String displayId,
        String disciplina,
        String tipoDiseno,
        String calidadMaterial,
        String tipoUniforme,
        List<String> prendas,
        List<Long> secuenciaAreas,
        Integer substepActual,
        String estado
) {
}
