package utez.edu.mx.cpm.backend.modules.auth.preConfig.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.AdjuntoService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.repository.AdjuntoRepository;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Adjunto;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.AdjuntoDto;
import java.util.List;

@Service
public class AdjuntoServiceImpl implements AdjuntoService {

    @Autowired
    private AdjuntoRepository repository;

    @Override
    public List<Adjunto> findAll() { return repository.findAll(); }

    @Override
    public Adjunto findById(String id) { return repository.findById(id).orElse(null); }

    @Override
    public Adjunto save(AdjuntoDto dto) { return new Adjunto(); /* TODO */ }

    @Override
    public void deleteById(String id) { repository.deleteById(id); }
}
