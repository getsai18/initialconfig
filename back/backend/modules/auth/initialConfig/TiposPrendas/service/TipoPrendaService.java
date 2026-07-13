package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.service;

import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaResponse;

import java.util.List;

public interface TipoPrendaService {
    List<TipoPrendaResponse> findAll();
    TipoPrendaResponse findById(Long id);
    TipoPrendaResponse create(TipoPrendaRequest request);
    TipoPrendaResponse update(Long id, TipoPrendaRequest request);
    void delete(Long id);
}

