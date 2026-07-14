package utez.edu.mx.cpm.backend.modules.auth.preConfig.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.PedidoService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.repository.PedidoRepository;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Pedido;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.PedidoDto;
import java.util.List;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private PedidoRepository repository;

    @Override
    public List<Pedido> findAll() { return repository.findAll(); }

    @Override
    public Pedido findById(String id) { return repository.findById(id).orElse(null); }

    private java.util.concurrent.atomic.AtomicInteger counter = new java.util.concurrent.atomic.AtomicInteger(1);

    @Override
    public Pedido save(PedidoDto dto) {
        Pedido pedido = new Pedido();
        // Generación de ID: PED-DDMMYYYYHHMMSS-XXXX
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("ddMMyyyyHHmmss");
        String timestamp = java.time.LocalDateTime.now().format(formatter);
        String sequence = String.format("%04d", counter.getAndIncrement() % 10000);
        pedido.setId("PED-" + timestamp + "-" + sequence);
        
        // TODO: Mapear el resto de campos de dto a pedido
        
        return repository.save(pedido);
    }

    @Override
    public void deleteById(String id) { repository.deleteById(id); }
}
