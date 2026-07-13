package com.cds.initialconfig.security;

import com.cds.initialconfig.common.exception.AuthException;
import com.cds.initialconfig.user.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
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

    private final SecretKey key;
    private final long accessExpirationMinutes;
    private final long resetExpirationMinutes;

    public JwtService(
        @Value("${app.jwt.secret}") String secret,
        @Value("${app.jwt.access-expiration-minutes}") long accessExpirationMinutes,
        @Value("${app.jwt.reset-expiration-minutes}") long resetExpirationMinutes
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpirationMinutes = accessExpirationMinutes;
        this.resetExpirationMinutes = resetExpirationMinutes;
    }

    public String generateAccessToken(Usuario u) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(u.getUsuario())
            .claim("purpose", PURPOSE_ACCESS)
            .claim("userId", u.getId())
            .claim("role", u.getRole().name())
            .claim("areaId", u.getAreaId())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(accessExpirationMinutes * 60)))
            .signWith(key)
            .compact();
    }

    public String generatePasswordResetToken(Usuario u) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(u.getUsuario())
            .claim("purpose", PURPOSE_PASSWORD_RESET)
            .claim("userId", u.getId())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(resetExpirationMinutes * 60)))
            .signWith(key)
            .compact();
    }

    /** Devuelve null si el token es inválido o expiró, en vez de lanzar — usado por el filtro de auth. */
    public Claims tryParse(String token) {
        try {
            return parse(token);
        } catch (JwtException | IllegalArgumentException ex) {
            return null;
        }
    }

    /** Lanza AuthException (401) si el token es inválido, expiró, o no tiene el propósito esperado. */
    public Claims parseWithPurpose(String token, String expectedPurpose) {
        Claims claims;
        try {
            claims = parse(token);
        } catch (ExpiredJwtException ex) {
            throw new AuthException("El token expiró, vuelve a intentarlo.");
        } catch (JwtException | IllegalArgumentException ex) {
            throw new AuthException("Token inválido.");
        }
        if (!expectedPurpose.equals(claims.get("purpose", String.class))) {
            throw new AuthException("Token inválido.");
        }
        return claims;
    }

    private Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}
