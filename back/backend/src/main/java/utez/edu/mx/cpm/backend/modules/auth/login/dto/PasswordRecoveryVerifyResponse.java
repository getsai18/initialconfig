package utez.edu.mx.cpm.backend.modules.auth.login.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordRecoveryVerifyResponse {
    private String resetToken;
}
