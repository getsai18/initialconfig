package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActividadCatalogoRepository extends JpaRepository<ActividadCatalogo, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
}

