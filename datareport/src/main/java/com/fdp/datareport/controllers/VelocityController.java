package com.fdp.datareport.controllers;

import com.fdp.datareport.entities.Velocity;
import com.fdp.datareport.services.VelocityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/velocities")
@CrossOrigin(origins = "*")
public class VelocityController {

    @Autowired
    private VelocityService velocityService;

    @GetMapping
    public ResponseEntity<List<Velocity>> getAllVelocities() {
        return ResponseEntity.ok(velocityService.getAllVelocities());
    }

    @GetMapping("/scrum-area/{areaId}")
    public ResponseEntity<List<Velocity>> getByScrumArea(@PathVariable Long areaId) {
        return ResponseEntity.ok(velocityService.getVelocitiesByScrumAreaId(areaId));
    }

    @PostMapping("/{areaId}")
    public ResponseEntity<Velocity> createVelocity(@PathVariable Long areaId, @Valid @RequestBody Velocity velocity) {
        return ResponseEntity.ok(velocityService.createVelocity(areaId, velocity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Velocity> updateVelocity(@PathVariable Long id, @Valid @RequestBody Velocity velocity) {
        return ResponseEntity.ok(velocityService.updateVelocity(id, velocity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVelocity(@PathVariable Long id) {
        velocityService.deleteVelocity(id);
        return ResponseEntity.noContent().build();
    }

    // ──────── NEW ENDPOINT FOR CHART ────────
    @GetMapping("/chart-data")
    public ResponseEntity<List<Map<String, Object>>> getVelocityChartData() {
        return ResponseEntity.ok(velocityService.getVelocityGroupedByScrumArea());
    }
}
