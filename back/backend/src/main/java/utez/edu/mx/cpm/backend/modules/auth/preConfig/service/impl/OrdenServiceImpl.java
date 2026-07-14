package utez.edu.mx.cpm.backend.modules.auth.preConfig.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.OrdenService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.repository.OrdenRepository;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Orden;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.OrdenDto;
import java.util.List;

@Service
public class OrdenServiceImpl implements OrdenService {

    @Autowired
    private OrdenRepository repository;

    @Override
    public List<Orden> findAll() { return repository.findAll(); }

    @Override
    public Orden findById(String id) { return repository.findById(id).orElse(null); }

    private java.util.concurrent.atomic.AtomicInteger counter = new java.util.concurrent.atomic.AtomicInteger(1);

    @Override
    public Orden save(OrdenDto dto) {
        Orden orden = new Orden();
        // Generación de ID: ORD-DDMMYYYY-XXXX
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("ddMMyyyy");
        String timestamp = java.time.LocalDateTime.now().format(formatter);
        String sequence = String.format("%04d", counter.getAndIncrement() % 10000);
        
        orden.setId("ORD-" + timestamp + "-" + sequence);
        orden.setCode(orden.getId()); // Internal code
        
        // TODO: Mapear el resto de campos de dto a orden
        
        return repository.save(orden);
    }

    @Override
    public void deleteById(String id) { repository.deleteById(id); }
}
