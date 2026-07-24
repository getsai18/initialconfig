package utez.edu.mx.cpm.backend.modules.auth.preproduction.incidencias;

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
@Table(name = "incidencias")
public class Incidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pedido_id", nullable = false, length = 50)
    private String pedidoId;

    @Column(name = "orden_id", nullable = false, length = 50)
    private String ordenId;

    @Column(name = "area_origen", length = 100)
    private String areaOrigen;

    @Column(name = "area_reporta", length = 100)
    private String areaReporta;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String acciones;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IncidenciaEstado estado;

    @Column(name = "fecha_reporte", nullable = false)
    private LocalDateTime fechaReporte;

    @Column(name = "persona_valida", length = 150)
    private String personaValida;
}
