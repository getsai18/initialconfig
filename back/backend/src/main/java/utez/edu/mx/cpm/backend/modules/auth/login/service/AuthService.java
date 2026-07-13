package utez.edu.mx.cpm.backend.modules.auth.login.service;

import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryVerifyRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordRecoveryVerifyResponse;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.PasswordResetRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);

    void requestPasswordRecovery(PasswordRecoveryRequest request);

    PasswordRecoveryVerifyResponse verifyOtp(PasswordRecoveryVerifyRequest request);

    void resetPassword(PasswordResetRequest request);
}
