package com.fdp.datareport.controllers;

import com.fdp.datareport.entities.Area;
import com.fdp.datareport.services.AreaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "*")
public class AreaController {

    @Autowired
    private AreaService areaService;

    // Get all areas
    @GetMapping
    public ResponseEntity<List<Area>> getAllAreas() {
        List<Area> areas = areaService.getAllAreas();
        return ResponseEntity.ok(areas);
    }

    // Get an area by ID
    @GetMapping("/{id}")
    public ResponseEntity<Area> getAreaById(@PathVariable Long id) {
        return areaService.getAreaById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null)); // Return 404 if not found
    }

    // Add a new area
    @PostMapping
    public ResponseEntity<Area> addArea(@Valid @RequestBody Area area) {
        Area createdArea = areaService.addArea(area);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArea);
    }

    // Update an existing area
    @PutMapping("/{id}")
    public ResponseEntity<Area> updateArea(@PathVariable Long id,@Valid @RequestBody Area area) {
        Area updatedArea = areaService.updateArea(id, area);
        return updatedArea != null
                ? ResponseEntity.ok(updatedArea)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    // Delete an area
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArea(@PathVariable Long id) {
        if (areaService.deleteArea(id)) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found
        }
    }
}
