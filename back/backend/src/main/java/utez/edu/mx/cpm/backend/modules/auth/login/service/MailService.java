package utez.edu.mx.cpm.backend.modules.auth.login.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;
    private final long otpExpirationMinutes;

    public MailService(JavaMailSender mailSender, @Value("${app.otp.expiration-minutes}") long otpExpirationMinutes) {
        this.mailSender = mailSender;
        this.otpExpirationMinutes = otpExpirationMinutes;
    }

    public void sendOtpEmail(String to, String nombre, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Código de verificación - UniformPro Manager");
        message.setText(
                "Hola " + nombre + ",\n\n"
                        + "Tu código de verificación para recuperar tu contraseña es: " + otpCode + "\n\n"
                        + "Este código expira en " + otpExpirationMinutes + " minutos.\n\n"
                        + "Si tú no solicitaste este código, puedes ignorar este mensaje."
        );
        mailSender.send(message);
    }
}
