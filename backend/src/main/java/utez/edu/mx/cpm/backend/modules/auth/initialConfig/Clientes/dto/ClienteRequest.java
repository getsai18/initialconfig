package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "El nombre del cliente es requerido.")
    @Size(max = 50, message = "El nombre del cliente no puede exceder {max} caracteres.")
    private String nombre;
    @Size(max = 50, message = "El vendor del cliente no puede exceder {max} caracteres.")
    private String vendor;
    @Size(max = 500, message = "La información del cliente no puede exceder {max} caracteres.")
    private String informacion;
    // fechaRegistro es opcional aquí a propósito: en update() un valor en blanco
    // significa "conservar la fecha existente" (ver ClienteServiceImpl.update).
    private String fechaRegistro;
}

