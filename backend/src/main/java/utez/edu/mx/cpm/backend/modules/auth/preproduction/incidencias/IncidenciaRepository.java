package utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidenciaRepository extends JpaRepository<Incidencia, Long> {
    List<Incidencia> findByEstado(IncidenciaEstado estado);
}
