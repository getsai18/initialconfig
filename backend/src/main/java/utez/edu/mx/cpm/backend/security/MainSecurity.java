package utez.edu.mx.cpm.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class MainSecurity {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;
    private final RestAccessDeniedHandler restAccessDeniedHandler;

    private final String[] WHITE_LIST = {
            "/version",
            "/changelog.json",
            "/Logo-utez.png",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain mainFilter(HttpSecurity http) {
        http.csrf(AbstractHttpConfigurer::disable).cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(restAuthenticationEntryPoint)
                        .accessDeniedHandler(restAccessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**", "/api/v1/auth/**").permitAll()
                        .requestMatchers(WHITE_LIST).permitAll()
                        .requestMatchers(HttpMethod.GET, "/users/**", "/api/v1/usuarios/**", "/areas/**", "/api/v1/areas/**", "/activities/**", "/api/v1/actividades/**", "/prendas/**", "/api/v1/prendas/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/clientes/**", "/api/v1/clientes/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT")
                        .requestMatchers(HttpMethod.DELETE, "/users/**", "/api/v1/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/users/**", "/api/v1/usuarios/**", "/areas/**", "/api/v1/areas/**", "/activities/**", "/api/v1/actividades/**", "/prendas/**", "/api/v1/prendas/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/users/**", "/api/v1/usuarios/**", "/areas/**", "/api/v1/areas/**", "/activities/**", "/api/v1/actividades/**", "/prendas/**", "/api/v1/prendas/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/areas/**", "/api/v1/areas/**", "/activities/**", "/api/v1/actividades/**", "/prendas/**", "/api/v1/prendas/**", "/clientes/**", "/api/v1/clientes/**")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/clientes/**", "/api/v1/clientes/**").hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT")
                        .requestMatchers(HttpMethod.PUT, "/clientes/**", "/api/v1/clientes/**").hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT")
                        // Gestor de Órdenes (preproduction): Pedidos/Kits/Ordenes son datos operativos
                        // propios del Gestor, no catálogo administrativo — a diferencia de /clientes,
                        // aquí MANAGEMENT también puede eliminar.
                        .requestMatchers(HttpMethod.GET, "/pedidos/**", "/api/v1/pedidos/**", "/kits/**", "/api/v1/kits/**", "/ordenes/**", "/api/v1/ordenes/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT")
                        .requestMatchers(HttpMethod.POST, "/pedidos/**", "/api/v1/pedidos/**", "/kits/**", "/api/v1/kits/**", "/ordenes/**", "/api/v1/ordenes/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT")
                        .requestMatchers(HttpMethod.PUT, "/pedidos/**", "/api/v1/pedidos/**", "/kits/**", "/api/v1/kits/**", "/ordenes/**", "/api/v1/ordenes/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT")
                        .requestMatchers(HttpMethod.DELETE, "/pedidos/**", "/api/v1/pedidos/**", "/kits/**", "/api/v1/kits/**", "/ordenes/**", "/api/v1/ordenes/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT")
                        .requestMatchers(HttpMethod.GET, "/incidencias/**", "/api/v1/incidencias/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT", "EMPLOYEE")
                        .requestMatchers(HttpMethod.POST, "/incidencias/**", "/api/v1/incidencias/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PUT, "/incidencias/**", "/api/v1/incidencias/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT", "EMPLOYEE")
                        .requestMatchers(HttpMethod.GET, "/confirmaciones/**", "/api/v1/confirmaciones/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT", "ATTENDANCE")
                        .requestMatchers(HttpMethod.POST, "/confirmaciones/**", "/api/v1/confirmaciones/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT", "ATTENDANCE")
                        // Adjuntos de Pedidos/Ordenes: mismos roles que pueden subirlos/borrarlos
                        // también para listarlos y descargarlos — no es lectura pública general.
                        .requestMatchers(HttpMethod.GET, "/pedidos/*/adjuntos/**", "/api/v1/pedidos/*/adjuntos/**", "/ordenes/*/adjuntos/**", "/api/v1/ordenes/*/adjuntos/**")
                        .hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
