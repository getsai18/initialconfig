package utez.edu.mx.cpm.backend.modules.auth.preConfig.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.KitService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.repository.KitRepository;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Kit;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.KitDto;
import java.util.List;

@Service
public class KitServiceImpl implements KitService {

    @Autowired
    private KitRepository repository;

    @Override
    public List<Kit> findAll() { return repository.findAll(); }

    @Override
    public Kit findById(String id) { return repository.findById(id).orElse(null); }

    @Override
    public Kit save(KitDto dto) { return new Kit(); /* TODO */ }

    @Override
    public void deleteById(String id) { repository.deleteById(id); }
}
