package utez.edu.mx.cpm.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import utez.edu.mx.cpm.backend.modules.auth.exceptions.AuthException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.Usuario;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

/**
 * Emite y valida dos tipos de token con propósitos distintos, para que uno no
 * pueda usarse en lugar del otro: ACCESS (sesión normal) y PASSWORD_RESET
 * (solo entre "verificar OTP" y "cambiar contraseña").
 */
@Service
public class JwtService {

    public static final String PURPOSE_ACCESS = "ACCESS";
    public static final String PURPOSE_PASSWORD_RESET = "PASSWORD_RESET";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms:86400000}")
    private String expirationMs;

    @Value("${app.otp.reset-token-expiration-ms:600000}")
    private String resetExpirationMs;

    public String generateToken(Usuario usuario) {
        Date issuedAt = new Date();
        Date expirationDate = new Date(issuedAt.getTime() + parseLongOrDefault(expirationMs, 86400000L));

        return Jwts.builder()
                .setSubject(usuario.getUsuario())
                .setIssuedAt(issuedAt)
                .setExpiration(expirationDate)
                .claim("purpose", PURPOSE_ACCESS)
                .claim("userId", usuario.getId())
                .claim("nombre", usuario.getNombre())
                .claim("role", usuario.getRol().name())
                .claim("areaId", usuario.getArea() != null ? usuario.getArea().getId() : null)
                .claim("areaNombre", usuario.getArea() != null ? usuario.getArea().getNombre() : null)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generatePasswordResetToken(Usuario usuario) {
        Date issuedAt = new Date();
        Date expirationDate = new Date(issuedAt.getTime() + parseLongOrDefault(resetExpirationMs, 600000L));

        return Jwts.builder()
                .setSubject(usuario.getUsuario())
                .setIssuedAt(issuedAt)
                .setExpiration(expirationDate)
                .claim("purpose", PURPOSE_PASSWORD_RESET)
                .claim("userId", usuario.getId())
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, Usuario usuario) {
        Claims claims;
        try {
            claims = extractClaims(token);
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
        return PURPOSE_ACCESS.equals(claims.get("purpose", String.class))
                && usuario.getUsuario().equalsIgnoreCase(claims.getSubject())
                && !claims.getExpiration().before(new Date());
    }

    /** Lanza AuthException (401) si el token es inválido, expiró, o no tiene el propósito esperado. */
    public Claims parseWithPurpose(String token, String expectedPurpose) {
        Claims claims;
        try {
            claims = extractClaims(token);
        } catch (ExpiredJwtException ex) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "El token expiró, vuelve a intentarlo.");
        } catch (JwtException | IllegalArgumentException ex) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Token inválido.");
        }
        if (!expectedPurpose.equals(claims.get("purpose", String.class))) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Token inválido.");
        }
        return claims;
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Deriva la llave de firma con SHA-256 en vez de rellenar con ceros: así
     * cualquier secreto corto (p. ej. el valor por defecto de desarrollo)
     * produce siempre una llave de 256 bits con entropía completa, en vez de
     * una llave parcialmente ceros que reduce el espacio de búsqueda real.
     */
    private SecretKey getSigningKey() {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(secret.getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 no disponible en este entorno.", exception);
        }
    }

    private long parseLongOrDefault(String value, long defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return Long.parseLong(value.trim());
    }
}
