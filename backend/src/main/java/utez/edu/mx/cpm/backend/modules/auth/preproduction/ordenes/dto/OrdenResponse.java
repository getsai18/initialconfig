package utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.dto;

import java.util.List;

public record OrdenResponse(
        Long id,
        Long pedidoId,
        String pedidoCodigo,
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
