package utez.edu.mx.cpm.backend.modules.auth.preConfig.service;

import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Incidencia;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.IncidenciaDto;
import java.util.List;

public interface IncidenciaService {
    List<Incidencia> findAll();
    Incidencia findById(Integer id);
    Incidencia save(IncidenciaDto dto);
    void deleteById(Integer id);
}
