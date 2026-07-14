package utez.edu.mx.cpm.backend.modules.auth.preConfig.model;

import jakarta.persistence.*;
import lombok.*;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.TipoPrenda;

import java.time.LocalDateTime;

@Entity
@Table(name = "orden_prendas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenPrenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orden_id")
    private Orden orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_prenda_id")
    private TipoPrenda tipoPrenda;

    @Column(name = "nombre_prenda_historico", length = 100)
    private String nombrePrendaHistorico;

    private Integer cantidad;

    @Column(length = 10)
    private String talla;

    @Column(length = 20)
    private String genero;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void prePersist() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }
}
