package com.cds.initialconfig.prenda;

import com.cds.initialconfig.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrendaService {

    private final PrendaRepository repository;

    public PrendaService(PrendaRepository repository) {
        this.repository = repository;
    }

    public List<Prenda> findAll() {
        return repository.findAll();
    }

    public Prenda findByIdOrThrow(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Prenda no encontrada: " + id));
    }

    public Prenda create(PrendaRequest req) {
        if (req.id() == null) throw new IllegalArgumentException("id es requerido");
        if (req.nombre() == null || req.nombre().isBlank()) throw new IllegalArgumentException("nombre es requerido");
        if (req.nombre().length() > 30) throw new IllegalArgumentException("nombre máximo 30 caracteres");
        if (req.icono() == null) throw new IllegalArgumentException("icono es requerido");

        Prenda prenda = Prenda.builder()
            .id(req.id())
            .nombre(req.nombre())
            .icono(req.icono())
            .build();
        return repository.save(prenda);
    }

    public Prenda update(Long id, PrendaRequest req) {
        Prenda prenda = findByIdOrThrow(id);

        if (req.nombre() != null) {
            if (req.nombre().isBlank()) throw new IllegalArgumentException("nombre no puede estar vacío");
            if (req.nombre().length() > 30) throw new IllegalArgumentException("nombre máximo 30 caracteres");
            prenda.setNombre(req.nombre());
        }
        if (req.icono() != null) prenda.setIcono(req.icono());

        return repository.save(prenda);
    }

    public void delete(Long id) {
        Prenda prenda = findByIdOrThrow(id);
        repository.delete(prenda);
    }
}
