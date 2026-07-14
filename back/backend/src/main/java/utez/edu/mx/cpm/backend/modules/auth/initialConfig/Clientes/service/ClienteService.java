package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteResponse;

public interface ClienteService {
    Page<ClienteResponse> findAll(Pageable pageable, String q);
    ClienteResponse findById(String id);
    ClienteResponse create(ClienteRequest request);
    ClienteResponse update(String id, ClienteRequest request);
    void delete(String id);
}

