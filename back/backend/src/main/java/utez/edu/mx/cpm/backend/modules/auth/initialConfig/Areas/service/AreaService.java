package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto.AreaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.dto.AreaResponse;

public interface AreaService {
    Page<AreaResponse> findAll(Pageable pageable, String q);
    AreaResponse findById(Long id);
    AreaResponse create(AreaRequest request);
    AreaResponse update(Long id, AreaRequest request);
    void delete(Long id);
}

