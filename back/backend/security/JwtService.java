package utez.edu.mx.cpm.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.Usuario;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private Long expirationMs;

    public String generateToken(Usuario usuario) {
        Date issuedAt = new Date();
        Date expirationDate = new Date(issuedAt.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(usuario.getUsuario())
                .setIssuedAt(issuedAt)
                .setExpiration(expirationDate)
                .claim("userId", usuario.getId())
                .claim("nombre", usuario.getNombre())
                .claim("rol", usuario.getRol().toFrontendValue())
                .claim("rolDb", usuario.getRol().name())
                .claim("areaId", usuario.getArea() != null ? usuario.getArea().getId() : null)
                .claim("areaNombre", usuario.getArea() != null ? usuario.getArea().getNombre() : null)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, Usuario usuario) {
        String username = extractUsername(token);
        return username != null
                && username.equalsIgnoreCase(usuario.getUsuario())
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            byte[] expanded = new byte[32];
            System.arraycopy(keyBytes, 0, expanded, 0, keyBytes.length);
            keyBytes = expanded;
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

