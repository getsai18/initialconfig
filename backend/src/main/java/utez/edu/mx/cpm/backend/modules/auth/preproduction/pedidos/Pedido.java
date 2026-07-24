package utez.edu.mx.cpm.backend.modules.auth.preproduction.pedidos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Clientes.Cliente;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.kits.Kit;
import utez.edu.mx.cpm.backend.modules.auth.preproduction.ordenes.Orden;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    @ToString.Exclude
    private Cliente cliente;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @Column(name = "fecha_entrega", nullable = false)
    private LocalDate fechaEntrega;

    @Column(nullable = false)
    private Boolean prioridad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PedidoEstado estado;

    @OneToMany(mappedBy = "pedido", fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    private List<Orden> ordenes = new ArrayList<>();

    @OneToMany(mappedBy = "pedido", fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    private List<Kit> kits = new ArrayList<>();
}
