package utez.edu.mx.cpm.backend.modules.auth.preConfig.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.OrdenPrendaService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.OrdenPrenda;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.OrdenPrendaDto;
import java.util.List;

@RestController
@RequestMapping("/api/preconfig/ordenPrendas")
@CrossOrigin(origins = "*")
public class OrdenPrendaController {

    @Autowired
    private OrdenPrendaService service;

    @GetMapping
    public ResponseEntity<List<OrdenPrenda>> findAll() { return ResponseEntity.ok(service.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenPrenda> findById(@PathVariable Integer id) { return ResponseEntity.ok(service.findById(id)); }

    @PostMapping
    public ResponseEntity<OrdenPrenda> save(@RequestBody OrdenPrendaDto dto) { return ResponseEntity.ok(service.save(dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) { service.deleteById(id); return ResponseEntity.ok().build(); }
}
