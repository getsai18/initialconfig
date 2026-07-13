package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario;

public enum RolUsuario {
    ADMIN,
    SUB_ADMIN,
    MANAGEMENT,
    EMPLOYEE,
    ATTENDANCE;

    public String toFrontendValue() {
        return switch (this) {
            case SUB_ADMIN -> "subadmin";
            default -> name().toLowerCase();
        };
    }
}

