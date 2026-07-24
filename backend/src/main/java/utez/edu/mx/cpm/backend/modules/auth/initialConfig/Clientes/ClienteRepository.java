package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, String> {
    Page<Cliente> findByEstado(String estado, Pageable pageable);

    @Query("SELECT c FROM Cliente c WHERE c.estado = :estado "
            + "AND (LOWER(c.nombre) LIKE LOWER(CONCAT('%', :term, '%')) "
            + "OR LOWER(c.vendor) LIKE LOWER(CONCAT('%', :term, '%')))")
    Page<Cliente> searchByEstado(@Param("estado") String estado, @Param("term") String term, Pageable pageable);
}

