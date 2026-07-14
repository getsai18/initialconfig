package com.cds.initialconfig.auth;

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
        message.setSubject("Código de verificación - CDS Initial Config");
        message.setText(
            "Hola " + nombre + ",\n\n"
                + "Tu código de verificación para recuperar tu contraseña es: " + otpCode + "\n\n"
                + "Este código expira en " + otpExpirationMinutes + " minutos.\n\n"
                + "Si tú no solicitaste este código, puedes ignorar este mensaje."
        );
        mailSender.send(message);
    }

    public void sendInitialPasswordEmail(String to, String nombre, String usuario, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Bienvenido a UniformPro - Credenciales de Acceso");
        message.setText(
                "Hola " + nombre + ",\n\n"
                        + "Tu cuenta en UniformPro Manager ha sido creada con éxito.\n\n"
                        + "Tus credenciales de acceso temporales son:\n"
                        + "- Usuario: " + usuario + "\n"
                        + "- Contraseña: " + password + "\n\n"
                        + "Por seguridad, te sugerimos cambiar tu contraseña al iniciar sesión por primera vez.\n\n"
                        + "Saludos,\nEl equipo de UniformPro"
        );
        mailSender.send(message);
    }
}
