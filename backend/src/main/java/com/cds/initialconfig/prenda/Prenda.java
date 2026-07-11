package com.cds.initialconfig.prenda;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "prendas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prenda {

    @Id
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IconoPrenda icono;
}
