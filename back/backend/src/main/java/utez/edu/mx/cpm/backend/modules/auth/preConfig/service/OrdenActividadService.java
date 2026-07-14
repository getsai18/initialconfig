package utez.edu.mx.cpm.backend.modules.auth.preConfig.service;

import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.OrdenActividad;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.OrdenActividadDto;
import java.util.List;

public interface OrdenActividadService {
    List<OrdenActividad> findAll();
    OrdenActividad findById(Integer id);
    OrdenActividad save(OrdenActividadDto dto);
    void deleteById(Integer id);
}
