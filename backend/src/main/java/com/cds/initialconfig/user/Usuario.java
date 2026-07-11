package com.cds.initialconfig.user;

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

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String usuario;

    @Column(nullable = false, length = 30)
    private String nombre;

    @Column(length = 30)
    private String email;

    /** Hash BCrypt. Nullable: el formulario de creación del frontend hoy no
     *  envía password (ver bug reportado en el resumen de esta sesión). */
    @Column(length = 100)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    /** Sin FK real a propósito: el frontend ya resuelve el nombre del área
     *  cruzando listas en el cliente; no hace falta la relación JPA. */
    @Column(name = "area_id")
    private Long areaId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoUsuario estado;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;
}
