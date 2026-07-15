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

    public MailService(JavaMailSender mailSender, @Value("${app.otp.expiration-minutes}") long otpExpirationMinutes) {
        this.mailSender = mailSender;
        this.otpExpirationMinutes = otpExpirationMinutes;
    }

    public void sendOtpEmail(String to, String nombre, String otpCode) {
        String contenido =
                "<p style=\"margin:0 0 16px;\">Hola <strong>" + nombre + "</strong>,</p>"
                        + "<p style=\"margin:0 0 24px;\">Tu código de verificación para recuperar tu contraseña es:</p>"
                        + "<div style=\"text-align:center;margin:0 0 24px;\">"
                        + "<span style=\"display:inline-block;padding:16px 36px;font-size:32px;font-weight:700;letter-spacing:8px;color:#4f46e5;background-color:#eef2ff;border:1px dashed #c7d2fe;border-radius:10px;\">"
                        + otpCode
                        + "</span>"
                        + "</div>"
                        + "<p style=\"margin:0 0 24px;text-align:center;\">Este código expira en <strong>" + otpExpirationMinutes + " minutos</strong>.</p>"
                        + "<hr style=\"border:none;border-top:1px solid #e5e7eb;margin:0 0 20px;\">"
                        + "<p style=\"margin:0;color:#9ca3af;font-size:12px;\">Si tú no solicitaste este código, puedes ignorar este mensaje con total tranquilidad.</p>";

        send(to, "Código de verificación - UniformPro Manager", "🔐", "Recuperación de contraseña", contenido);
    }

    public void sendInitialPasswordEmail(String to, String nombre, String usuario, String password) {
        String contenido =
                "<p style=\"margin:0 0 16px;\">Hola <strong>" + nombre + "</strong>,</p>"
                        + "<p style=\"margin:0 0 24px;\">Tu cuenta en UniformPro Manager ha sido creada con éxito. Estas son tus credenciales de acceso temporales:</p>"
                        + "<table role=\"presentation\" style=\"width:100%;border-collapse:separate;border-spacing:0;margin:0 0 24px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;\">"
                        + "<tr>"
                        + "<td style=\"padding:14px 16px;background-color:#f9fafb;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;width:40%;\">Usuario</td>"
                        + "<td style=\"padding:14px 16px;background-color:#ffffff;font-size:15px;font-weight:700;color:#111827;border-bottom:1px solid #e5e7eb;\">" + usuario + "</td>"
                        + "</tr>"
                        + "<tr>"
                        + "<td style=\"padding:14px 16px;background-color:#f9fafb;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;\">Contraseña</td>"
                        + "<td style=\"padding:14px 16px;background-color:#ffffff;font-size:15px;font-weight:700;color:#111827;\">" + password + "</td>"
                        + "</tr>"
                        + "</table>"
                        + "<div style=\"padding:14px 16px;background-color:#fffbeb;border:1px solid #fde68a;border-radius:10px;margin:0 0 20px;\">"
                        + "<p style=\"margin:0;color:#92400e;font-size:13px;\">⚠ Por seguridad, te sugerimos cambiar tu contraseña al iniciar sesión por primera vez.</p>"
                        + "</div>"
                        + "<p style=\"margin:0;color:#6b7280;font-size:13px;\">Saludos,<br>El equipo de UniformPro</p>";

        send(to, "Bienvenido a UniformPro - Credenciales de Acceso", "👋", "Bienvenido a UniformPro Manager", contenido);
    }

    private void send(String to, String subject, String iconEmoji, String heading, String contentHtml) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(buildHtml(iconEmoji, heading, contentHtml), true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new MailSendException("No se pudo enviar el correo a " + to, e);
        }
    }

    private String buildHtml(String iconEmoji, String heading, String contentHtml) {
        return "<!DOCTYPE html>"
                + "<html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></head>"
                + "<body style=\"margin:0;padding:0;background-color:#f0f0f3;font-family:'Segoe UI', Arial, Helvetica, sans-serif;\">"
                + "<table role=\"presentation\" style=\"width:100%;border-collapse:collapse;background-color:#f0f0f3;\">"
                + "<tr><td align=\"center\" style=\"padding:40px 16px;\">"
                + "<table role=\"presentation\" style=\"width:100%;max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(17,24,39,0.08);\">"
                + "<tr><td style=\"background-color:#111827;background-image:linear-gradient(135deg,#111827,#312e81);padding:28px 32px;\">"
                + "<span style=\"color:#ffffff;font-size:19px;font-weight:700;letter-spacing:0.3px;\">UniformPro Manager</span>"
                + "</td></tr>"
                + "<tr><td style=\"padding:36px 32px 32px;\">"
                + "<div style=\"width:52px;height:52px;line-height:52px;text-align:center;border-radius:50%;background-color:#eef2ff;font-size:24px;margin:0 0 16px;\">" + iconEmoji + "</div>"
                + "<h1 style=\"margin:0 0 20px;font-size:20px;color:#111827;\">" + heading + "</h1>"
                + "<div style=\"font-size:14px;line-height:1.6;color:#374151;\">" + contentHtml + "</div>"
                + "</td></tr>"
                + "<tr><td style=\"padding:18px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;\">"
                + "<span style=\"font-size:12px;color:#9ca3af;\">© 2026 UniformesPro. Todos los derechos reservados.</span>"
                + "</td></tr>"
                + "</table>"
                + "</td></tr>"
                + "</table>"
                + "</body></html>";
    }
}
