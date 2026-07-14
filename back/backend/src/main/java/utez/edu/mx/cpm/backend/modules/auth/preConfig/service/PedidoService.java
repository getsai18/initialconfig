package utez.edu.mx.cpm.backend.modules.auth.preConfig.service;

import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Pedido;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.PedidoDto;
import java.util.List;

public interface PedidoService {
    List<Pedido> findAll();
    Pedido findById(String id);
    Pedido save(PedidoDto dto);
    void deleteById(String id);
}
