package utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto.IncidenciaRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto.IncidenciaResolverRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias.dto.IncidenciaResponse;

public interface IncidenciaService {
    Page<IncidenciaResponse> findAll(Pageable pageable, String estado);

    IncidenciaResponse create(IncidenciaRequest request);

    IncidenciaResponse resolver(Long id, IncidenciaResolverRequest request);
}
