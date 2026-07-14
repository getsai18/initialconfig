package utez.edu.mx.cpm.backend.modules.auth.preConfig.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.OrdenActividadService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.OrdenActividad;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.OrdenActividadDto;
import java.util.List;

@RestController
@RequestMapping("/api/preconfig/ordenActividads")
@CrossOrigin(origins = "*")
public class OrdenActividadController {

    @Autowired
    private OrdenActividadService service;

    @GetMapping
    public ResponseEntity<List<OrdenActividad>> findAll() { return ResponseEntity.ok(service.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenActividad> findById(@PathVariable Integer id) { return ResponseEntity.ok(service.findById(id)); }

    @PostMapping
    public ResponseEntity<OrdenActividad> save(@RequestBody OrdenActividadDto dto) { return ResponseEntity.ok(service.save(dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) { service.deleteById(id); return ResponseEntity.ok().build(); }
}
