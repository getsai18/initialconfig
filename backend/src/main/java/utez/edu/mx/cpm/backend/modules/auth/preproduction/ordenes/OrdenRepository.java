package utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.Pedido;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    Optional<Orden> findByInternalCode(String internalCode);

    Page<Orden> findByPedido_CodigoContainingIgnoreCaseOrDisciplinaContainingIgnoreCase(
            String codigo, String disciplina, Pageable pageable);

    List<Orden> findByPedido(Pedido pedido);
}
