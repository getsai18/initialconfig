package com.cds.initialconfig.activity;

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

@RestController
@RequestMapping("/activities")
public class ActivityController {

    private final ActivityService service;

    public ActivityController(ActivityService service) {
        this.service = service;
    }

    @GetMapping
    public List<Activity> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Activity findById(@PathVariable Long id) {
        return service.findByIdOrThrow(id);
    }

    @PostMapping
    public Activity create(@RequestBody ActivityRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public Activity update(@PathVariable Long id, @RequestBody ActivityRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        service.delete(id);
        return Map.of("deleted", true, "id", id);
    }
}
