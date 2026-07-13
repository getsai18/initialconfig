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

/**
 * Reglas reales de autorización, respaldadas por JWT (JwtAuthenticationFilter).
 * La matriz de permisos por rol no está definida por el frontend (hoy solo
 * distingue isSubAdmin para ocultar el botón de borrar usuarios) — queda
 * centralizada aquí para poder ajustarla fácilmente si el cliente da otra regla.
 */
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
            "/error"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain mainFilter(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable).cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(restAuthenticationEntryPoint)
                        .accessDeniedHandler(restAccessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(WHITE_LIST).permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/users/**", "/areas/**", "/activities/**", "/prendas/**")
                            .hasAnyRole("ADMIN", "SUB_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/users/**", "/areas/**", "/activities/**", "/prendas/**")
                            .hasAnyRole("ADMIN", "SUB_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/areas/**", "/activities/**", "/prendas/**", "/clientes/**")
                            .hasAnyRole("ADMIN", "SUB_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/clientes/**").hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT")
                        .requestMatchers(HttpMethod.PUT, "/clientes/**").hasAnyRole("ADMIN", "SUB_ADMIN", "MANAGEMENT")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
