package com.cds.initialconfig.activity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoActividad tipo;

    /** Vacía si tipo=texto. Puede incluir un valor "__otro__:Etiqueta" para la
     *  respuesta "Otro". */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "activity_opciones", joinColumns = @JoinColumn(name = "activity_id"))
    @OrderColumn(name = "orden")
    @Column(name = "opcion", length = 255)
    @Builder.Default
    private List<String> opciones = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "activity_etiquetas", joinColumns = @JoinColumn(name = "activity_id"))
    @OrderColumn(name = "orden")
    @Column(name = "etiqueta", length = 100)
    @Builder.Default
    private List<String> etiquetas = new ArrayList<>();

    @Column(length = 500)
    private String nota;
}
