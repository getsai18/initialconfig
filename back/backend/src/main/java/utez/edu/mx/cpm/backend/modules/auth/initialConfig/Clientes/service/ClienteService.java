package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.service;

import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto.ClienteResponse;

import java.util.List;

public interface ClienteService {
    List<ClienteResponse> findAll();
    ClienteResponse findById(String id);
    ClienteResponse create(ClienteRequest request);
    ClienteResponse update(String id, ClienteRequest request);
    void delete(String id);
}

