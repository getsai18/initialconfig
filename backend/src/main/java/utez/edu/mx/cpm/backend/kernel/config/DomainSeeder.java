package utez.edu.mx.cpm.backend.kernel.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.Area;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.AreaRepository;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DomainSeeder implements CommandLineRunner {

    private final AreaRepository areaRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedAreas();
    }

    private void seedAreas() {
        List<SeedArea> seeds = List.of(
                new SeedArea("Diseño", 1),
                new SeedArea("Costura", 2),
                new SeedArea("Sublimación", 3),
                new SeedArea("DTF", 4),
                new SeedArea("Empaque", 5),
                new SeedArea("Gestión de Órdenes", 6),
                new SeedArea("Atención a Clientes", 7)
        );

        for (SeedArea seed : seeds) {
            areaRepository.findByNombreIgnoreCase(seed.nombre()).ifPresentOrElse(existing -> {
                existing.setOrdenSecuencia(seed.orden());
                existing.setActiva(Boolean.TRUE);
                existing.setEstado("activa");
                areaRepository.save(existing);
            }, () -> areaRepository.save(Area.builder()
                    .nombre(seed.nombre())
                    .ordenSecuencia(seed.orden())
                    .activa(Boolean.TRUE)
                    .descripcion(null)
                    .estado("activa")
                    .fechaCreacion(LocalDateTime.now())
                    .build()));
        }
    }

    private record SeedArea(String nombre, Integer orden) {
    }
}
