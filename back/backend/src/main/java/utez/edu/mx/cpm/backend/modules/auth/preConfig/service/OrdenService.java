package utez.edu.mx.cpm.backend.modules.auth.preConfig.service;

import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Orden;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.OrdenDto;
import java.util.List;

public interface OrdenService {
    List<Orden> findAll();
    Orden findById(String id);
    Orden save(OrdenDto dto);
    void deleteById(String id);
}
