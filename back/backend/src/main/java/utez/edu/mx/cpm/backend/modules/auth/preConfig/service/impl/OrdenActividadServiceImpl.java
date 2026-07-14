package utez.edu.mx.cpm.backend.modules.auth.preConfig.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.OrdenActividadService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.repository.OrdenActividadRepository;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.OrdenActividad;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.OrdenActividadDto;
import java.util.List;

@Service
public class OrdenActividadServiceImpl implements OrdenActividadService {

    @Autowired
    private OrdenActividadRepository repository;

    @Override
    public List<OrdenActividad> findAll() { return repository.findAll(); }

    @Override
    public OrdenActividad findById(Integer id) { return repository.findById(id).orElse(null); }

    @Override
    public OrdenActividad save(OrdenActividadDto dto) { return new OrdenActividad(); /* TODO */ }

    @Override
    public void deleteById(Integer id) { repository.deleteById(id); }
}
