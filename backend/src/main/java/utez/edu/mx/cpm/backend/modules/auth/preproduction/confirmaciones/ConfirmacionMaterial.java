package utez.edu.mx.cpm.backend.modules.auth.preproduction.confirmaciones;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "confirmaciones_material")
public class ConfirmacionMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pedido_id", nullable = false, length = 50)
    private String pedidoId;

    @Column(name = "orden_id", nullable = false, length = 50)
    private String ordenId;

    private String equipo;

    @Column(name = "area_origen")
    private String areaOrigen;

    @Column(name = "area_destino")
    private String areaDestino;

    private String solicitante;

    private String validador;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ConfirmacionTipo tipo;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(columnDefinition = "TEXT")
    private String observaciones;
}
