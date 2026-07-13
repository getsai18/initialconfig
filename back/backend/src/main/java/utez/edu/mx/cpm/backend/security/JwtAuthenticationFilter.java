package utez.edu.mx.cpm.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.Usuario;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.UsuarioRepository;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);

            try {
                String username = jwtService.extractUsername(token);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    usuarioRepository.findByUsuarioIgnoreCase(username)
                            .filter(usuario -> "activo".equalsIgnoreCase(usuario.getEstado()))
                            .filter(usuario -> jwtService.isTokenValid(token, usuario))
                            .ifPresent(usuario -> authenticateRequest(request, usuario));
                }
            } catch (Exception ignored) {
                // El filtro solo intenta autenticar; la validación final la hace Spring Security.
            }
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateRequest(HttpServletRequest request, Usuario usuario) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                usuario.getUsuario(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()))
        );
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }
}

