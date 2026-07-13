package utez.edu.mx.cpm.backend.modules.auth.login.service;

import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginRequest;
import utez.edu.mx.cpm.backend.modules.auth.login.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}

