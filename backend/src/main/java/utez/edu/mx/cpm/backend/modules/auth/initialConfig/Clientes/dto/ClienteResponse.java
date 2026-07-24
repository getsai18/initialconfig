package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponse {
    private String id;
    private String nombre;
    private String vendor;
    private String informacion;
    private LocalDate fechaRegistro;
    private LocalDateTime fechaCreacion;
    private Boolean activo;
    private String estado;
}
