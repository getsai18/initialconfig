package utez.edu.mx.cpm.backend.modules.auth.preproduction.kits;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.Orden;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.Pedido;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "kits")
public class Kit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @ToString.Exclude
    private Pedido pedido;

    private String nombre;

    private String descripcion;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "kit_ordenes",
            joinColumns = @JoinColumn(name = "kit_id"),
            inverseJoinColumns = @JoinColumn(name = "orden_id")
    )
    @Builder.Default
    @ToString.Exclude
    private List<Orden> ordenes = new ArrayList<>();
}
