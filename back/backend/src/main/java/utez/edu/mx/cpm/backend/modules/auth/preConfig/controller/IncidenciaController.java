package utez.edu.mx.cpm.backend.modules.auth.preConfig.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.IncidenciaService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Incidencia;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.IncidenciaDto;
import java.util.List;

@RestController
@RequestMapping("/api/preconfig/incidencias")
@CrossOrigin(origins = "*")
public class IncidenciaController {

    @Autowired
    private IncidenciaService service;

    @GetMapping
    public ResponseEntity<List<Incidencia>> findAll() { return ResponseEntity.ok(service.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Incidencia> findById(@PathVariable Integer id) { return ResponseEntity.ok(service.findById(id)); }

    @PostMapping
    public ResponseEntity<Incidencia> save(@RequestBody IncidenciaDto dto) { return ResponseEntity.ok(service.save(dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) { service.deleteById(id); return ResponseEntity.ok().build(); }
}
