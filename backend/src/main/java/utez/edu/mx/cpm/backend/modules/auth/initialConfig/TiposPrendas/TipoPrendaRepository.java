package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoPrendaRepository extends JpaRepository<TipoPrenda, Long> {
    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

    Page<TipoPrenda> findByNombreContainingIgnoreCaseOrCategoriaContainingIgnoreCase(
            String nombre, String categoria, Pageable pageable);
}

