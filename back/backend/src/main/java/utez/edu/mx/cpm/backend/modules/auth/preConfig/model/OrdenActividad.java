package utez.edu.mx.cpm.backend.modules.auth.preConfig.model;

import jakarta.persistence.*;
import lombok.*;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Areas.Area;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Usuario.Usuario;

import java.time.LocalDateTime;

@Entity
@Table(name = "orden_actividades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenActividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orden_id")
    private Orden orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    @Column(name = "nombre_area_historico", length = 100)
    private String nombreAreaHistorico;

    @Column(name = "nombre_actividad_historico", length = 150)
    private String nombreActividadHistorico;

    @Column(name = "tipo_actividad", length = 50)
    private String tipoActividad;

    @Column(name = "opciones_seleccionadas", columnDefinition = "TEXT")
    private String opcionesSeleccionadas;

    @Column(columnDefinition = "TINYINT(1)")
    private Boolean completada;

    @Column(name = "fecha_completado")
    private LocalDateTime fechaCompletado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_completado_id")
    private Usuario usuarioCompletado;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void prePersist() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }
}
