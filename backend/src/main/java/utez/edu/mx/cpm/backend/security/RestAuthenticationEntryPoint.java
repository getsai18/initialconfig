package utez.edu.mx.cpm.backend.security;

import tools.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import utez.edu.mx.cpm.backend.kernel.utils.ApiResponse;

import java.io.IOException;

/**
 * ApiGateway.js hace response.json() en TODAS las respuestas sin mirar el
 * status code primero, así que un 401 sin body JSON rompería al frontend.
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public RestAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ApiResponse body = ApiResponse.failure("Se requiere iniciar sesión para acceder a este recurso", null);
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
