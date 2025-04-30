package com.fdp.datareport.Controller;

import com.fdp.datareport.Entity.ScrumArea;
import com.fdp.datareport.Service.ScrumAreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scrum-areas")
@CrossOrigin(origins = "*")
public class ScrumAreaController {

    @Autowired
    private ScrumAreaService scrumAreaService;

    @GetMapping
    public ResponseEntity<List<ScrumArea>> getAllScrumAreas() {
        return ResponseEntity.ok(scrumAreaService.getAllScrumAreas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScrumArea> getScrumAreaById(@PathVariable Long id) {
        return scrumAreaService.getScrumAreaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ScrumArea> createScrumArea(@RequestBody ScrumArea scrumArea) {
        return ResponseEntity.ok(scrumAreaService.createScrumArea(scrumArea));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScrumArea> updateScrumArea(@PathVariable Long id, @RequestBody ScrumArea updated) {
        return ResponseEntity.ok(scrumAreaService.updateScrumArea(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScrumArea(@PathVariable Long id) {
        scrumAreaService.deleteScrumArea(id);
        return ResponseEntity.noContent().build();
    }
}
