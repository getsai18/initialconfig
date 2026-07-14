package utez.edu.mx.cpm.backend.modules.auth.preConfig.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.OrdenPrendaService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.repository.OrdenPrendaRepository;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.OrdenPrenda;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.OrdenPrendaDto;
import java.util.List;

@Service
public class OrdenPrendaServiceImpl implements OrdenPrendaService {

    @Autowired
    private OrdenPrendaRepository repository;

    @Override
    public List<OrdenPrenda> findAll() { return repository.findAll(); }

    @Override
    public OrdenPrenda findById(Integer id) { return repository.findById(id).orElse(null); }

    @Override
    public OrdenPrenda save(OrdenPrendaDto dto) { return new OrdenPrenda(); /* TODO */ }

    @Override
    public void deleteById(Integer id) { repository.deleteById(id); }
}
