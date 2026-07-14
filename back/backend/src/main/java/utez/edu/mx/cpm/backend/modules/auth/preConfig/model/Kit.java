package utez.edu.mx.cpm.backend.modules.auth.preConfig.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "kits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Kit {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @Column(length = 150)
    private String nombre;

    private LocalDate fecha;

    @Column(length = 50)
    private String status;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void prePersist() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }
}
