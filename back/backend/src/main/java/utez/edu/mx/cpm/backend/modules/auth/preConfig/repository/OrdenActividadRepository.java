package utez.edu.mx.cpm.backend.modules.auth.preConfig.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.OrdenActividad;

@Repository
public interface OrdenActividadRepository extends JpaRepository<OrdenActividad, Integer> {
}

