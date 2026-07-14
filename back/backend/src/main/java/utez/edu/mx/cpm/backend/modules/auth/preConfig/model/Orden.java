package utez.edu.mx.cpm.backend.modules.auth.preConfig.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ordenes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orden {

    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 150)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kit_id")
    private Kit kit;

    @Column(length = 50)
    private String status;

    @Column(length = 100)
    private String disciplina;

    @Column(length = 100)
    private String categoria;

    @Column(name = "tipo_solicitud", length = 100)
    private String tipoSolicitud;

    @Column(name = "tipo_diseno", length = 50)
    private String tipoDiseno;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "secuencia_areas", columnDefinition = "TEXT")
    private String secuenciaAreas;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void prePersist() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }
}
