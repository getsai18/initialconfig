package utez.edu.mx.cpm.backend.modules.auth.preConfig.service;

import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Kit;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.KitDto;
import java.util.List;

public interface KitService {
    List<Kit> findAll();
    Kit findById(String id);
    Kit save(KitDto dto);
    void deleteById(String id);
}
