package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.service;

import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto.AreaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto.AreaResponse;

import java.util.List;

public interface AreaService {
    List<AreaResponse> findAll();
    AreaResponse findById(Long id);
    AreaResponse create(AreaRequest request);
    AreaResponse update(Long id, AreaRequest request);
    void delete(Long id);
}

