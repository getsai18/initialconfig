package utez.edu.mx.cpm.backend.kernel.config;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.RolUsuario;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.Usuario;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.UsuarioRepository;

/**
 * Siembra la cuenta administrativa inicial (idempotente) para no depender de
 * insertar el primer usuario manualmente en la base de datos.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsuario;
    private final String adminPassword;

    public AdminSeeder(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin-seed.usuario}") String adminUsuario,
            @Value("${app.admin-seed.password}") String adminPassword
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.adminUsuario = adminUsuario;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (adminUsuario == null || adminUsuario.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            return;
        }
        if (repository.findByUsuarioIgnoreCase(adminUsuario).isPresent()) {
            return;
        }

        Usuario admin = Usuario.builder()
                .usuario(adminUsuario.toLowerCase())
                .fechaCreacion(LocalDateTime.now())
                .nombre("Administrador")
                .email(adminUsuario + "@uniformespro.com")
                .password(passwordEncoder.encode(adminPassword))
                .rol(RolUsuario.ADMIN)
                .estado("activo")
                .build();

        repository.save(admin);
        log.info("Usuario administrador '{}' creado automáticamente.", adminUsuario);
    }
}
