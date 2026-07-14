package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto.ActividadCatalogoRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto.ActividadCatalogoResponse;

public interface ActividadCatalogoService {
    Page<ActividadCatalogoResponse> findAll(Pageable pageable, String q);
    ActividadCatalogoResponse findById(Long id);
    ActividadCatalogoResponse create(ActividadCatalogoRequest request);
    ActividadCatalogoResponse update(Long id, ActividadCatalogoRequest request);
    void delete(Long id);
}

