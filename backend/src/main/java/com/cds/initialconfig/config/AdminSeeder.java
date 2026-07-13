package com.cds.initialconfig.config;

import com.cds.initialconfig.user.EstadoUsuario;
import com.cds.initialconfig.user.Role;
import com.cds.initialconfig.user.Usuario;
import com.cds.initialconfig.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Antes, "admin"/"12345a" era una credencial hardcodeada en el frontend que no
 * correspondía a ningún usuario real. Ahora que el backend exige autenticación
 * real, sembramos esa misma cuenta como usuario real en BD (idempotente) para
 * no perder el acceso administrativo inicial.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);
    private static final long ADMIN_SEED_ID = 1L;

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsuario;
    private final String adminPassword;

    public AdminSeeder(
        UserRepository repository,
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
        if (repository.findByUsuario(adminUsuario).isPresent()) {
            return;
        }

        Usuario admin = Usuario.builder()
            .id(ADMIN_SEED_ID)
            .usuario(adminUsuario)
            .nombre("Administrador")
            .password(passwordEncoder.encode(adminPassword))
            .role(Role.ADMIN)
            .estado(EstadoUsuario.activo)
            .fechaCreacion(LocalDate.now())
            .build();

        repository.save(admin);
        log.info("Usuario administrador '{}' creado automáticamente.", adminUsuario);
    }
}
