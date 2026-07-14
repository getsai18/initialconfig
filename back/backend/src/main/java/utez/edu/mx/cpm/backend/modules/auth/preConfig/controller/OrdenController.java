package utez.edu.mx.cpm.backend.modules.auth.preConfig.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.OrdenService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Orden;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.OrdenDto;
import java.util.List;

@RestController
@RequestMapping("/api/preconfig/ordens")
@CrossOrigin(origins = "*")
public class OrdenController {

    @Autowired
    private OrdenService service;

    @GetMapping
    public ResponseEntity<List<Orden>> findAll() { return ResponseEntity.ok(service.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Orden> findById(@PathVariable String id) { return ResponseEntity.ok(service.findById(id)); }

    @PostMapping
    public ResponseEntity<Orden> save(@RequestBody OrdenDto dto) { return ResponseEntity.ok(service.save(dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable String id) { service.deleteById(id); return ResponseEntity.ok().build(); }
}
