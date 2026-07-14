package utez.edu.mx.cpm.backend.modules.auth.preConfig.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.IncidenciaService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.repository.IncidenciaRepository;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Incidencia;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.IncidenciaDto;
import java.util.List;

@Service
public class IncidenciaServiceImpl implements IncidenciaService {

    @Autowired
    private IncidenciaRepository repository;

    @Override
    public List<Incidencia> findAll() { return repository.findAll(); }

    @Override
    public Incidencia findById(Integer id) { return repository.findById(id).orElse(null); }

    @Override
    public Incidencia save(IncidenciaDto dto) { return new Incidencia(); /* TODO */ }

    @Override
    public void deleteById(Integer id) { repository.deleteById(id); }
}
