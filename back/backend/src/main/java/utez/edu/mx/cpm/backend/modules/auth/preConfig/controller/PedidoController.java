package utez.edu.mx.cpm.backend.modules.auth.preConfig.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.PedidoService;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.Pedido;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.PedidoDto;
import java.util.List;

@RestController
@RequestMapping("/api/preconfig/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService service;

    @GetMapping
    public ResponseEntity<List<Pedido>> findAll() { return ResponseEntity.ok(service.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> findById(@PathVariable String id) { return ResponseEntity.ok(service.findById(id)); }

    @PostMapping
    public ResponseEntity<Pedido> save(@RequestBody PedidoDto dto) { return ResponseEntity.ok(service.save(dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable String id) { service.deleteById(id); return ResponseEntity.ok().build(); }
}
