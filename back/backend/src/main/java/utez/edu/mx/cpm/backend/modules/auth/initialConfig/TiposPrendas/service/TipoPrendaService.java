package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaResponse;

public interface TipoPrendaService {
    Page<TipoPrendaResponse> findAll(Pageable pageable, String q);
    TipoPrendaResponse findById(Long id);
    TipoPrendaResponse create(TipoPrendaRequest request);
    TipoPrendaResponse update(Long id, TipoPrendaRequest request);
    void delete(Long id);
}

