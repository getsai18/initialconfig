package utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfirmacionRepository extends JpaRepository<ConfirmacionMaterial, Long> {
}
