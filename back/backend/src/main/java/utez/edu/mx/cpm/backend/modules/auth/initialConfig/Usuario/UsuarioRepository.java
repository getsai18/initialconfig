package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsuarioIgnoreCase(String usuario);

    Optional<Usuario> findByEmailIgnoreCase(String email);

    boolean existsByArea_Id(Long areaId);

    Page<Usuario> findByNombreContainingIgnoreCaseOrUsuarioContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String nombre, String usuario, String email, Pageable pageable);
}

