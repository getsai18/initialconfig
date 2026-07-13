package utez.edu.mx.cpm.backend.modules.auth.login.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequest {
    private String resetToken;
    private String nuevaPassword;
}
