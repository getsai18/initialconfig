package utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos.Pedido;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ordenes")
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @ToString.Exclude
    private Pedido pedido;

    @Column(name = "internal_code", nullable = false, unique = true, length = 80)
    private String internalCode;

    @Column(name = "display_id", nullable = false, unique = true, length = 80)
    private String displayId;

    @Column(nullable = false, length = 100)
    private String disciplina;

    @Column(name = "tipo_diseno", length = 30)
    private String tipoDiseno;

    @Column(name = "calidad_material", length = 100)
    private String calidadMaterial;

    @Column(name = "tipo_uniforme", length = 100)
    private String tipoUniforme;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "orden_prendas", joinColumns = @JoinColumn(name = "orden_id"))
    @OrderColumn(name = "orden")
    @Builder.Default
    private List<String> prendas = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "orden_secuencia_areas", joinColumns = @JoinColumn(name = "orden_id"))
    @OrderColumn(name = "orden")
    @Builder.Default
    private List<Long> secuenciaAreas = new ArrayList<>();

    @Column(name = "substep_actual")
    private Integer substepActual;

    @Column(nullable = false, length = 30)
    private String estado;
}
