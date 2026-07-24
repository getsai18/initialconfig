package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoRequest;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.dto.PedidoResponse;

import java.util.List;

public interface PedidoService {
    Page<PedidoResponse> findAll(Pageable pageable, String q);

    PedidoResponse findById(Long id);

    PedidoResponse create(PedidoRequest request);

    PedidoResponse update(Long id, PedidoRequest request);

    List<PedidoResponse> findByClienteId(String clienteId);
}
