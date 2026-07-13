package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoPrendaRepository extends JpaRepository<TipoPrenda, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
}

