package utez.edu.mx.cpm.backend.modules.auth.login.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;
    private final long otpExpirationMinutes;

    public MailService(JavaMailSender mailSender, @Value("${app.otp.expiration-minutes:10}") String otpExpirationMinutes) {
        this.mailSender = mailSender;
        this.otpExpirationMinutes = parseLongOrDefault(otpExpirationMinutes, 10L);
    }

    public void sendOtpEmail(String to, String nombre, String otpCode) {
        String contenido =
                "<p style=\"margin:0 0 16px;\">Estimado/a <strong style=\"color:#1e293b;\">" + nombre + "</strong>,</p>"
                        + "<p style=\"margin:0 0 24px;\">Se ha solicitado un código de verificación para acceder a su cuenta. Por favor, utilice el siguiente código de seguridad (OTP):</p>"
                        + "<div style=\"text-align:center; margin:0 0 24px;\">"
                        + "<span style=\"display:inline-block; padding:14px 40px; font-size:28px; font-weight:bold; letter-spacing:8px; color:#1e293b; background-color:#f1f5f9; border:1px solid #cbd5e1; border-radius:4px; font-family:'Courier New', Courier, monospace;\">"
                        + otpCode
                        + "</span>"
                        + "</div>"
                        + "<p style=\"margin:0 0 24px; font-size:14px;\">Este código tiene una validez de <strong>" + otpExpirationMinutes + " minutos</strong>.</p>"
                        + "<p style=\"margin:0; color:#64748b; font-size:13px; padding-top:16px; border-top:1px solid #e2e8f0;\">Si usted no realizó esta solicitud, puede ignorar este mensaje. Su cuenta permanece segura.</p>";

        send(to, "Código de seguridad - UniformPro Manager", "Recuperación de contraseña", contenido);
    }

    public void sendInitialPasswordEmail(String to, String nombre, String usuario, String password) {
        String contenido =
                "<p style=\"margin:0 0 16px;\">Estimado/a <strong style=\"color:#1e293b;\">" + nombre + "</strong>,</p>"
                        + "<p style=\"margin:0 0 24px;\">Su cuenta en el sistema <strong>UniformPro Manager</strong> ha sido aprovisionada exitosamente. A continuación, se detallan sus credenciales de acceso iniciales:</p>"
                        + "<table role=\"presentation\" style=\"width:100%; border-collapse:collapse; margin:0 0 24px; border:1px solid #e2e8f0; border-radius:4px;\">"
                        + "<tr>"
                        + "<td style=\"padding:12px 16px; background-color:#f8fafc; font-size:13px; color:#475569; text-transform:uppercase; font-weight:600; width:30%; border-bottom:1px solid #e2e8f0; border-right:1px solid #e2e8f0;\">Usuario</td>"
                        + "<td style=\"padding:12px 16px; font-size:15px; font-weight:bold; color:#1e293b; border-bottom:1px solid #e2e8f0;\">" + usuario + "</td>"
                        + "</tr>"
                        + "<tr>"
                        + "<td style=\"padding:12px 16px; background-color:#f8fafc; font-size:13px; color:#475569; text-transform:uppercase; font-weight:600; border-right:1px solid #e2e8f0;\">Contraseña</td>"
                        + "<td style=\"padding:12px 16px; font-size:15px; font-weight:bold; color:#1e293b; font-family:'Courier New', Courier, monospace;\">" + password + "</td>"
                        + "</tr>"
                        + "</table>"
                        + "<div style=\"padding:16px; background-color:#f0f9ff; border-left:4px solid #0284c7; margin:0 0 24px;\">"
                        + "<p style=\"margin:0; color:#0369a1; font-size:14px;\"><strong>Aviso de Seguridad:</strong> Es estrictamente necesario que actualice esta contraseña al iniciar sesión por primera vez.</p>"
                        + "</div>"
                        + "<p style=\"margin:0; font-size:14px;\">Atentamente,<br><strong style=\"color:#1e293b;\">Administración de Sistemas UniformPro</strong></p>";

        send(to, "Credenciales de Acceso - UniformPro Manager", "Bienvenido a UniformPro Manager", contenido);
    }

    private void send(String to, String subject, String heading, String contentHtml) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(buildHtml(heading, contentHtml), true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new MailSendException("No se pudo enviar el correo a " + to, e);
        }
    }

    private String buildHtml(String heading, String contentHtml) {
        return "<!DOCTYPE html>"
                + "<html lang=\"es\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></head>"
                + "<body style=\"margin:0; padding:0; background-color:#f4f6f8; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased; color:#333333;\">"
                + "<table role=\"presentation\" style=\"width:100%; border-collapse:collapse; background-color:#f4f6f8;\">"
                + "<tr><td align=\"center\" style=\"padding:40px 20px;\">"
                + "<table role=\"presentation\" style=\"width:100%; max-width:600px; background-color:#ffffff; border:1px solid #e1e5ea; border-radius:4px; overflow:hidden;\">"
                + "<tr><td style=\"background-color:#1e293b; padding:30px 40px; text-align:center; border-bottom:3px solid #3b82f6;\">"
                + "<span style=\"color:#ffffff; font-size:24px; font-weight:600; letter-spacing:1px; text-transform:uppercase;\">UniformPro</span>"
                + "<span style=\"color:#94a3b8; font-size:24px; font-weight:300; letter-spacing:1px; text-transform:uppercase;\"> Manager</span>"
                + "</td></tr>"
                + "<tr><td style=\"padding:40px;\">"
                + "<h1 style=\"margin:0 0 20px; font-size:20px; font-weight:600; color:#1e293b; border-bottom:1px solid #e2e8f0; padding-bottom:10px;\">" + heading + "</h1>"
                + "<div style=\"font-size:15px; line-height:1.6; color:#475569;\">" + contentHtml + "</div>"
                + "</td></tr>"
                + "<tr><td style=\"padding:20px 40px; background-color:#f8fafc; border-top:1px solid #e1e5ea; text-align:center;\">"
                + "<p style=\"margin:0; font-size:12px; color:#64748b; line-height:1.5;\">Este es un mensaje automático, por favor no responda a este correo.<br>© 2026 UniformesPro. Todos los derechos reservados.</p>"
                + "</td></tr>"
                + "</table>"
                + "</td></tr>"
                + "</table>"
                + "</body></html>";
    }

    private long parseLongOrDefault(String value, long defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return Long.parseLong(value.trim());
    }
}