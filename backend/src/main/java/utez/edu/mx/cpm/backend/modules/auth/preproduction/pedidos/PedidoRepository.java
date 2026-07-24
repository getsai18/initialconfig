package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByCodigo(String codigo);

    long countByCodigoStartingWith(String codigoPrefix);

    Page<Pedido> findByCodigoContainingIgnoreCase(Pageable pageable, String codigo);

    @Query("SELECT p FROM Pedido p WHERE LOWER(p.codigo) LIKE LOWER(CONCAT('%', :q, '%')) "
            + "OR LOWER(p.cliente.nombre) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Pedido> search(@Param("q") String q, Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"cliente"})
    List<Pedido> findByCliente_IdOrderByFechaRegistroDesc(String clienteId);

    List<Pedido> findByFechaRegistroBetween(LocalDateTime from, LocalDateTime to);
}
