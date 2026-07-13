package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequest {
    private String id;
    private String nombre;
    private String vendor;
    private String informacion;
    private String fechaRegistro;
}

