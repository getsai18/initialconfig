package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.service;

import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto.ActividadCatalogoRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto.ActividadCatalogoResponse;

import java.util.List;

public interface ActividadCatalogoService {
    List<ActividadCatalogoResponse> findAll();
    ActividadCatalogoResponse findById(Long id);
    ActividadCatalogoResponse create(ActividadCatalogoRequest request);
    ActividadCatalogoResponse update(Long id, ActividadCatalogoRequest request);
    void delete(Long id);
}

