package utez.edu.mx.cpm.backend.modules.auth.login.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.dto.UsuarioResponse;

/** LoginPage.jsx lee result.token y result.usuario.{nombre,role,...} — el
 *  usuario autenticado va anidado, no aplanado, para que calce con ese contrato. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UsuarioResponse usuario;
}
