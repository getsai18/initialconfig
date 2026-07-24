package utez.edu.mx.cpm.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import utez.edu.mx.cpm.backend.modules.auth.exceptions.AuthException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Bloqueo simple en memoria contra fuerza bruta en /auth/login. No sustituye
 * un rate-limiter distribuido (no sobrevive un reinicio ni se comparte entre
 * instancias), pero cubre el caso de una sola instancia sin sumar infra nueva.
 */
@Component
public class LoginAttemptService {

    private static class State {
        int failures;
        Instant lockedUntil;
    }

    private final ConcurrentHashMap<String, State> attemptsByUser = new ConcurrentHashMap<>();

    @Value("${app.login.max-attempts:5}")
    private String maxAttempts;

    @Value("${app.login.lockout-minutes:15}")
    private String lockoutMinutes;

    public void assertNotLocked(String usuario) {
        State state = attemptsByUser.get(normalize(usuario));
        if (state == null) {
            return;
        }
        synchronized (state) {
            if (state.lockedUntil != null && Instant.now().isBefore(state.lockedUntil)) {
                throw new AuthException(HttpStatus.TOO_MANY_REQUESTS,
                        "Demasiados intentos fallidos. Intenta de nuevo en unos minutos.");
            }
        }
    }

    public void registerFailure(String usuario) {
        State state = attemptsByUser.computeIfAbsent(normalize(usuario), key -> new State());
        synchronized (state) {
            if (state.lockedUntil != null && !Instant.now().isBefore(state.lockedUntil)) {
                state.failures = 0;
                state.lockedUntil = null;
            }
            state.failures++;
            if (state.failures >= parseIntOrDefault(maxAttempts, 5)) {
                state.lockedUntil = Instant.now().plus(parseLongOrDefault(lockoutMinutes, 15L), ChronoUnit.MINUTES);
            }
        }
    }

    public void registerSuccess(String usuario) {
        attemptsByUser.remove(normalize(usuario));
    }

    private String normalize(String usuario) {
        return usuario == null ? "" : usuario.trim().toLowerCase();
    }

    private int parseIntOrDefault(String value, int defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return Integer.parseInt(value.trim());
    }

    private long parseLongOrDefault(String value, long defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return Long.parseLong(value.trim());
    }
}
