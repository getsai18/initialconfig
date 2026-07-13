package com.cds.initialconfig.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    Optional<PasswordResetOtp> findTopByUsuarioIdAndUsedFalseOrderByIdDesc(Long usuarioId);
}
