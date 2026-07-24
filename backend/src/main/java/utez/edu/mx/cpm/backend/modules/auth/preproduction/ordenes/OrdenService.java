package utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.dto.OrdenRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.dto.OrdenResponse;

public interface OrdenService {
    Page<OrdenResponse> findAll(Pageable pageable, String q);

    OrdenResponse findById(Long id);

    OrdenResponse create(OrdenRequest request);

    OrdenResponse avanzarArea(Long id);
}
