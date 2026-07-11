package com.cds.initialconfig.cliente;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "clientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    /** UUID generado por el frontend (crypto.randomUUID()); el backend lo respeta
     *  si viene en el body de creación. */
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 100)
    private String vendor;

    @Column(length = 300)
    private String informacion;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;
}
