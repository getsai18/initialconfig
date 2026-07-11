package com.cds.initialconfig.prenda;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** No expone GET /prendas/{id}: el frontend no lo usa (PrendasService no
 *  tiene getById). */
@RestController
@RequestMapping("/prendas")
public class PrendaController {

    private final PrendaService service;

    public PrendaController(PrendaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Prenda> findAll() {
        return service.findAll();
    }

    @PostMapping
    public Prenda create(@RequestBody PrendaRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public Prenda update(@PathVariable Long id, @RequestBody PrendaRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        service.delete(id);
        return Map.of("deleted", true, "id", id);
    }
}
