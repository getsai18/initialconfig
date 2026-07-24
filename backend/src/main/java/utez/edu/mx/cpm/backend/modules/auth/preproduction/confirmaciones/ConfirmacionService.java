package utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones.dto.ConfirmacionRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones.dto.ConfirmacionResponse;

public interface ConfirmacionService {
    Page<ConfirmacionResponse> findAll(Pageable pageable);

    ConfirmacionResponse create(ConfirmacionRequest request);
}
