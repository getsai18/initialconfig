package com.cds.initialconfig.activity;

import com.cds.initialconfig.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository repository;

    public ActivityService(ActivityRepository repository) {
        this.repository = repository;
    }

    public List<Activity> findAll() {
        return repository.findAll();
    }

    public Activity findByIdOrThrow(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Actividad no encontrada: " + id));
    }

    public Activity create(ActivityRequest req) {
        if (req.id() == null) throw new IllegalArgumentException("id es requerido");
        if (req.nombre() == null || req.nombre().isBlank()) throw new IllegalArgumentException("nombre es requerido");
        if (req.nombre().length() > 30) throw new IllegalArgumentException("nombre máximo 30 caracteres");
        if (req.tipo() == null) throw new IllegalArgumentException("tipo es requerido");

        Activity activity = Activity.builder()
            .id(req.id())
            .nombre(req.nombre())
            .tipo(req.tipo())
            .opciones(req.opciones() != null ? new ArrayList<>(req.opciones()) : new ArrayList<>())
            .etiquetas(req.etiquetas() != null ? new ArrayList<>(req.etiquetas()) : new ArrayList<>())
            .nota(req.nota())
            .build();
        return repository.save(activity);
    }

    public Activity update(Long id, ActivityRequest req) {
        Activity activity = findByIdOrThrow(id);

        if (req.nombre() != null) {
            if (req.nombre().isBlank()) throw new IllegalArgumentException("nombre no puede estar vacío");
            if (req.nombre().length() > 30) throw new IllegalArgumentException("nombre máximo 30 caracteres");
            activity.setNombre(req.nombre());
        }
        if (req.tipo() != null) activity.setTipo(req.tipo());
        if (req.opciones() != null) {
            activity.getOpciones().clear();
            activity.getOpciones().addAll(req.opciones());
        }
        if (req.etiquetas() != null) {
            activity.getEtiquetas().clear();
            activity.getEtiquetas().addAll(req.etiquetas());
        }
        if (req.nota() != null) activity.setNota(req.nota());

        return repository.save(activity);
    }

    public void delete(Long id) {
        Activity activity = findByIdOrThrow(id);
        repository.delete(activity);
    }
}
