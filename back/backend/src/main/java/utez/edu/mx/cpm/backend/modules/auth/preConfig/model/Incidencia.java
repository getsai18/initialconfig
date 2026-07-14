package utez.edu.mx.cpm.backend.modules.auth.preConfig.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidencias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orden_id")
    private Orden orden;

    @Column(name = "area_origen", length = 100)
    private String areaOrigen;

    @Column(name = "area_reporta", length = 100)
    private String areaReporta;

    @Column(name = "persona_valida", length = 150)
    private String personaValida;

    @Column(name = "descripcion_falla", columnDefinition = "TEXT")
    private String descripcionFalla;

    @Column(name = "accion_inmediata", columnDefinition = "TEXT")
    private String accionInmediata;

    @Column(length = 50)
    private String severidad;

    @Column(length = 50)
    private String estado;

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void prePersist() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }
}
