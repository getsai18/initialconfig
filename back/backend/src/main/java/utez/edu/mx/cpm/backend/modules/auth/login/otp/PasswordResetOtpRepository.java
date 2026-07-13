package utez.edu.mx.cpm.backend.modules.auth.login.otp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    Optional<PasswordResetOtp> findTopByUsuarioIdAndUsedFalseOrderByIdDesc(Long usuarioId);
}
