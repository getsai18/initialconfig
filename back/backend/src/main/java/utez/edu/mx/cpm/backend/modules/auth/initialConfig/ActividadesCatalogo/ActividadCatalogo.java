package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "actividades_catalogo")
public class ActividadCatalogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 20)
    private String tipo;

    /** Vacía si tipo=texto. Puede incluir un valor "__otro__:Etiqueta" para la
     *  respuesta "Otro". */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "actividad_catalogo_opciones", joinColumns = @JoinColumn(name = "actividad_id"))
    @OrderColumn(name = "orden")
    @Column(name = "opcion", length = 255)
    @Builder.Default
    private List<String> opciones = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "actividad_catalogo_etiquetas", joinColumns = @JoinColumn(name = "actividad_id"))
    @OrderColumn(name = "orden")
    @Column(name = "etiqueta", length = 100)
    @Builder.Default
    private List<String> etiquetas = new ArrayList<>();

    @Column(length = 500)
    private String nota;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;
}

