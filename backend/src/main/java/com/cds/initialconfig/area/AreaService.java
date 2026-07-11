package com.cds.initialconfig.area;

import com.cds.initialconfig.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AreaService {

    private final AreaRepository repository;

    public AreaService(AreaRepository repository) {
        this.repository = repository;
    }

    public List<Area> findAll() {
        return repository.findAll();
    }

    public Area findByIdOrThrow(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Área no encontrada: " + id));
    }

    public Area create(AreaRequest req) {
        if (req.id() == null) throw new IllegalArgumentException("id es requerido");
        if (req.nombre() == null || req.nombre().isBlank()) throw new IllegalArgumentException("nombre es requerido");
        if (req.nombre().length() > 30) throw new IllegalArgumentException("nombre máximo 30 caracteres");
        if (req.descripcion() != null && req.descripcion().length() > 130) {
            throw new IllegalArgumentException("descripcion máximo 130 caracteres");
        }

        Area area = Area.builder()
            .id(req.id())
            .nombre(req.nombre())
            .descripcion(req.descripcion())
            .estado(req.estado() != null ? req.estado() : EstadoArea.inactiva)
            .build();
        return repository.save(area);
    }

    public Area update(Long id, AreaRequest req) {
        Area area = findByIdOrThrow(id);

        if (req.nombre() != null) {
            if (req.nombre().isBlank()) throw new IllegalArgumentException("nombre no puede estar vacío");
            if (req.nombre().length() > 30) throw new IllegalArgumentException("nombre máximo 30 caracteres");
            area.setNombre(req.nombre());
        }
        if (req.descripcion() != null) {
            if (req.descripcion().length() > 130) throw new IllegalArgumentException("descripcion máximo 130 caracteres");
            area.setDescripcion(req.descripcion());
        }
        if (req.estado() != null) area.setEstado(req.estado());

        return repository.save(area);
    }

    public void delete(Long id) {
        Area area = findByIdOrThrow(id);
        repository.delete(area);
    }
}
