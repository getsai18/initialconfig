const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Estadias\\propyectos\\initialconfig\\back\\backend\\src\\main\\java\\utez\\edu\\mx\\cpm\\backend\\modules\\auth\\preConfig';
const entities = ['Cliente', 'Pedido', 'Kit', 'Orden', 'OrdenPrenda', 'OrdenActividad', 'Adjunto', 'Incidencia', 'ActividadCatalogo', 'TipoPrenda'];

const dirs = ['dto', 'service', 'service/impl', 'controller'];
dirs.forEach(dir => fs.mkdirSync(path.join(basePath, dir), { recursive: true }));

entities.forEach(e => {
    const isInteger = ["ActividadCatalogo", "TipoPrenda", "OrdenPrenda", "OrdenActividad", "Incidencia"].includes(e);
    const type = isInteger ? 'Integer' : 'String';
    const lce = e.charAt(0).toLowerCase() + e.slice(1);

    const dto = `package utez.edu.mx.cpm.backend.modules.auth.preConfig.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ${e}Dto {
    private ${type} id;
}
`;
    fs.writeFileSync(path.join(basePath, 'dto', `${e}Dto.java`), dto);

    const svc = `package utez.edu.mx.cpm.backend.modules.auth.preConfig.service;

import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.${e};
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.${e}Dto;
import java.util.List;

public interface ${e}Service {
    List<${e}> findAll();
    ${e} findById(${type} id);
    ${e} save(${e}Dto dto);
    void deleteById(${type} id);
}
`;
    fs.writeFileSync(path.join(basePath, 'service', `${e}Service.java`), svc);

    const impl = `package utez.edu.mx.cpm.backend.modules.auth.preConfig.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.${e}Service;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.repository.${e}Repository;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.${e};
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.${e}Dto;
import java.util.List;

@Service
public class ${e}ServiceImpl implements ${e}Service {

    @Autowired
    private ${e}Repository repository;

    @Override
    public List<${e}> findAll() { return repository.findAll(); }

    @Override
    public ${e} findById(${type} id) { return repository.findById(id).orElse(null); }

    @Override
    public ${e} save(${e}Dto dto) { return new ${e}(); /* TODO */ }

    @Override
    public void deleteById(${type} id) { repository.deleteById(id); }
}
`;
    fs.writeFileSync(path.join(basePath, 'service/impl', `${e}ServiceImpl.java`), impl);

    const ctrl = `package utez.edu.mx.cpm.backend.modules.auth.preConfig.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.service.${e}Service;
import utez.edu.mx.cpm.backend.modules.auth.preConfig.model.${e};
import utez.edu.mx.cpm.backend.modules.auth.preConfig.dto.${e}Dto;
import java.util.List;

@RestController
@RequestMapping("/api/preconfig/${lce}s")
@CrossOrigin(origins = "*")
public class ${e}Controller {

    @Autowired
    private ${e}Service service;

    @GetMapping
    public ResponseEntity<List<${e}>> findAll() { return ResponseEntity.ok(service.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<${e}> findById(@PathVariable ${type} id) { return ResponseEntity.ok(service.findById(id)); }

    @PostMapping
    public ResponseEntity<${e}> save(@RequestBody ${e}Dto dto) { return ResponseEntity.ok(service.save(dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable ${type} id) { service.deleteById(id); return ResponseEntity.ok().build(); }
}
`;
    fs.writeFileSync(path.join(basePath, 'controller', `${e}Controller.java`), ctrl);
});
console.log('Done!');
