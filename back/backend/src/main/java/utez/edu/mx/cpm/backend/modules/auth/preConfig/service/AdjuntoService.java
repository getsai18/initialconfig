package utez.edu.mx.cpm.backend.modules.auth.preConfig.service;

import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Adjunto;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.AdjuntoDto;
import java.util.List;

public interface AdjuntoService {
    List<Adjunto> findAll();
    Adjunto findById(String id);
    Adjunto save(AdjuntoDto dto);
    void deleteById(String id);
}
