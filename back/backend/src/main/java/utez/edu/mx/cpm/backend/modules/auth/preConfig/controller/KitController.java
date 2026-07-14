package utez.edu.mx.cpm.backend.modules.auth.preConfig.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.KitService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Kit;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.KitDto;
import java.util.List;

@RestController
@RequestMapping("/api/preconfig/kits")
@CrossOrigin(origins = "*")
public class KitController {

    @Autowired
    private KitService service;

    @GetMapping
    public ResponseEntity<List<Kit>> findAll() { return ResponseEntity.ok(service.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Kit> findById(@PathVariable String id) { return ResponseEntity.ok(service.findById(id)); }

    @PostMapping
    public ResponseEntity<Kit> save(@RequestBody KitDto dto) { return ResponseEntity.ok(service.save(dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable String id) { service.deleteById(id); return ResponseEntity.ok().build(); }
}
