package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
    Optional<Area> findByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCase(String nombre);

    Page<Area> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(
            String nombre, String descripcion, Pageable pageable);
}

