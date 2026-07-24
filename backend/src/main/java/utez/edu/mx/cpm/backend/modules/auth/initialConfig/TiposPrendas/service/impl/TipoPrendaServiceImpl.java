package utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.kernel.exceptions.AppException;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.TipoPrenda;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.TipoPrendaRepository;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaRequest;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.dto.TipoPrendaResponse;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class TipoPrendaServiceImpl implements utez.edu.mx.cpm.backend.modules.auth.initialConfig.TiposPrendas.service.TipoPrendaService {

    /** Únicas categorías/iconos que el catálogo admite (ver ICONO_EMOJI/TALLAS_DEFAULT del frontend anterior). */
    private static final Set<String> CATEGORIAS_VALIDAS = Set.of("superiores", "inferiores", "accesorios", "otros");

    private final TipoPrendaRepository tipoPrendaRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<TipoPrendaResponse> findAll(Pageable pageable, String q) {
        if (q == null || q.isBlank()) {
            return tipoPrendaRepository.findAll(pageable).map(this::toResponse);
        }
        String term = q.trim();
        return tipoPrendaRepository.findByNombreContainingIgnoreCaseOrCategoriaContainingIgnoreCase(term, term, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TipoPrendaResponse findById(Long id) {
        return toResponse(findEntity(id));
    }

    @Override
    public TipoPrendaResponse create(TipoPrendaRequest request) {
        String nombre = required(request.getNombre(), "El nombre de la prenda es requerido.");
        if (tipoPrendaRepository.existsByNombreIgnoreCase(nombre)) {
            throw new AppException(HttpStatus.CONFLICT, "Ya existe una prenda con ese nombre.");
        }
        String icono = validarIcono(normalizeOptional(request.getIcono()));
        TipoPrenda tipoPrenda = TipoPrenda.builder()
                .nombre(nombre)
                .categoria(resolveCategoria(request.getCategoria(), icono))
                .icono(icono)
                .tallasDisponibles(normalizeOptional(request.getTallasDisponibles()))
                .fechaCreacion(LocalDateTime.now())
                .build();
        return toResponse(tipoPrendaRepository.save(tipoPrenda));
    }

    @Override
    public TipoPrendaResponse update(Long id, TipoPrendaRequest request) {
        TipoPrenda tipoPrenda = findEntity(id);
        String nombre = required(request.getNombre(), "El nombre de la prenda es requerido.");
        boolean duplicate = tipoPrendaRepository.existsByNombreIgnoreCaseAndIdNot(nombre, id);
        if (duplicate) {
            throw new AppException(HttpStatus.CONFLICT, "Ya existe una prenda con ese nombre.");
        }
        String icono = validarIcono(normalizeOptional(request.getIcono()));
        tipoPrenda.setNombre(nombre);
        tipoPrenda.setCategoria(resolveCategoria(request.getCategoria(), icono));
        tipoPrenda.setIcono(icono);
        tipoPrenda.setTallasDisponibles(normalizeOptional(request.getTallasDisponibles()));
        return toResponse(tipoPrendaRepository.save(tipoPrenda));
    }

    /** El frontend (PrendasPage.jsx) no tiene un campo de categoría propio: sólo
     *  envía "icono" (superiores/inferiores/accesorios/otros), que ya funciona
     *  como categoría gruesa de la prenda. Se usa ese valor por defecto para no
     *  romper la columna NOT NULL sin inventar un campo que el frontend no pide.
     *  El resultado se valida contra la lista fija de categorías admitidas. */
    private String resolveCategoria(String categoria, String icono) {
        String resuelta;
        if (categoria != null && !categoria.isBlank()) {
            resuelta = categoria.trim();
        } else if (icono != null && !icono.isBlank()) {
            resuelta = icono;
        } else {
            throw new AppException(HttpStatus.BAD_REQUEST, "La categoría es requerida.");
        }
        if (!CATEGORIAS_VALIDAS.contains(resuelta.toLowerCase())) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "La categoría debe ser una de: " + String.join(", ", CATEGORIAS_VALIDAS) + ".");
        }
        return resuelta;
    }

    private String validarIcono(String icono) {
        if (icono != null && !CATEGORIAS_VALIDAS.contains(icono.toLowerCase())) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "El icono debe ser uno de: " + String.join(", ", CATEGORIAS_VALIDAS) + ".");
        }
        return icono;
    }

    @Override
    public void delete(Long id) {
        tipoPrendaRepository.delete(findEntity(id));
    }

    private TipoPrenda findEntity(Long id) {
        if (id == null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "El identificador de la prenda es requerido.");
        }
        return tipoPrendaRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Tipo de prenda no encontrado."));
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

    private TipoPrendaResponse toResponse(TipoPrenda tipoPrenda) {
        return TipoPrendaResponse.builder()
                .id(tipoPrenda.getId())
                .nombre(tipoPrenda.getNombre())
                .categoria(tipoPrenda.getCategoria())
                .icono(tipoPrenda.getIcono())
                .tallasDisponibles(tipoPrenda.getTallasDisponibles())
                .fechaCreacion(tipoPrenda.getFechaCreacion())
                .build();
    }
}

