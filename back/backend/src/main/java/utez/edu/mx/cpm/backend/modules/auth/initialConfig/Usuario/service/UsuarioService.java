package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioResponse;

public interface UsuarioService {
    Page<UsuarioResponse> findAll(Pageable pageable, String q);
    UsuarioResponse findById(Long id);
    UsuarioResponse create(UsuarioRequest request);
    UsuarioResponse update(Long id, UsuarioRequest request);
    void delete(Long id);
}

