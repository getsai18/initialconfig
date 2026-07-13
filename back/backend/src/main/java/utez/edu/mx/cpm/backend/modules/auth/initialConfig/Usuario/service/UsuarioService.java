package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.service;

import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioResponse;

import java.util.List;

public interface UsuarioService {
    List<UsuarioResponse> findAll();
    UsuarioResponse findById(Long id);
    UsuarioResponse create(UsuarioRequest request);
    UsuarioResponse update(Long id, UsuarioRequest request);
    void delete(Long id);
}

