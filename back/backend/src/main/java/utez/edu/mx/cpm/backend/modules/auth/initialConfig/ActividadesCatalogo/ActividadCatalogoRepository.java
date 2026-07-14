package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActividadCatalogoRepository extends JpaRepository<ActividadCatalogo, Long> {
    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

    Page<ActividadCatalogo> findByNombreContainingIgnoreCaseOrTipoContainingIgnoreCase(
            String nombre, String tipo, Pageable pageable);
}

