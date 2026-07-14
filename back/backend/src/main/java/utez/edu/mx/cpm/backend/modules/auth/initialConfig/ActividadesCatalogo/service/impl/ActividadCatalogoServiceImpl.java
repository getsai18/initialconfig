package utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.ActividadCatalogo;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.ActividadCatalogoRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto.ActividadCatalogoRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.dto.ActividadCatalogoResponse;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Transactional
public class ActividadCatalogoServiceImpl implements utez.edu.mx.cpm.backend.modules.auth.initialConfig.ActividadesCatalogo.service.ActividadCatalogoService {

    private final ActividadCatalogoRepository actividadCatalogoRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ActividadCatalogoResponse> findAll(Pageable pageable, String q) {
        if (q == null || q.isBlank()) {
            return actividadCatalogoRepository.findAll(pageable).map(this::toResponse);
        }
        String term = q.trim();
        return actividadCatalogoRepository.findByNombreContainingIgnoreCaseOrTipoContainingIgnoreCase(term, term, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ActividadCatalogoResponse findById(Long id) {
        return toResponse(findEntity(id));
    }

    @Override
    public ActividadCatalogoResponse create(ActividadCatalogoRequest request) {
        String nombre = required(request.getNombre(), "El nombre de la actividad es requerido.");
        if (actividadCatalogoRepository.existsByNombreIgnoreCase(nombre)) {
            throw new AppException(HttpStatus.CONFLICT, "Ya existe una actividad con ese nombre.");
        }
        ActividadCatalogo actividad = ActividadCatalogo.builder()
                .nombre(nombre)
                .tipo(required(request.getTipo(), "El tipo de la actividad es requerido."))
                .opciones(request.getOpciones() != null ? new ArrayList<>(request.getOpciones()) : new ArrayList<>())
                .etiquetas(request.getEtiquetas() != null ? new ArrayList<>(request.getEtiquetas()) : new ArrayList<>())
                .nota(normalizeOptional(request.getNota()))
                .fechaCreacion(LocalDateTime.now())
                .build();
        return toResponse(actividadCatalogoRepository.save(actividad));
    }

    @Override
    public ActividadCatalogoResponse update(Long id, ActividadCatalogoRequest request) {
        ActividadCatalogo actividad = findEntity(id);
        String nombre = required(request.getNombre(), "El nombre de la actividad es requerido.");
        boolean duplicate = actividadCatalogoRepository.existsByNombreIgnoreCaseAndIdNot(nombre, id);
        if (duplicate) {
            throw new AppException(HttpStatus.CONFLICT, "Ya existe una actividad con ese nombre.");
        }
        actividad.setNombre(nombre);
        actividad.setTipo(required(request.getTipo(), "El tipo de la actividad es requerido."));
        if (request.getOpciones() != null) {
            actividad.getOpciones().clear();
            actividad.getOpciones().addAll(request.getOpciones());
        }
        if (request.getEtiquetas() != null) {
            actividad.getEtiquetas().clear();
            actividad.getEtiquetas().addAll(request.getEtiquetas());
        }
        actividad.setNota(normalizeOptional(request.getNota()));
        return toResponse(actividadCatalogoRepository.save(actividad));
    }

    @Override
    public void delete(Long id) {
        actividadCatalogoRepository.delete(findEntity(id));
    }

    private ActividadCatalogo findEntity(Long id) {
        if (id == null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El identificador de la actividad es requerido.");
        }
        return actividadCatalogoRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Actividad no encontrada."));
    }

    private String required(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new AppException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private ActividadCatalogoResponse toResponse(ActividadCatalogo actividad) {
        return ActividadCatalogoResponse.builder()
                .id(actividad.getId())
                .nombre(actividad.getNombre())
                .tipo(actividad.getTipo())
                .opciones(actividad.getOpciones())
                .etiquetas(actividad.getEtiquetas())
                .nota(actividad.getNota())
                .fechaCreacion(actividad.getFechaCreacion())
                .build();
    }
}

