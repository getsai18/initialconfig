package utez.edu.mx.cpm.backend.modules.auth.preConfig.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.OrdenPrenda;

@Repository
public interface OrdenPrendaRepository extends JpaRepository<OrdenPrenda, Integer> {
}

