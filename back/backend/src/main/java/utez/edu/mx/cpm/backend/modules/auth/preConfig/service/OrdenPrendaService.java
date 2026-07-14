package utez.edu.mx.cpm.backend.modules.auth.preConfig.service;

import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.OrdenPrenda;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.OrdenPrendaDto;
import java.util.List;

public interface OrdenPrendaService {
    List<OrdenPrenda> findAll();
    OrdenPrenda findById(Integer id);
    OrdenPrenda save(OrdenPrendaDto dto);
    void deleteById(Integer id);
}
