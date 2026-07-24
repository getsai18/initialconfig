package utez.edu.mx.cpm.backend.modules.auth.preproduction.kits;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KitRepository extends JpaRepository<Kit, Long> {
}
