package com.fdp.datareport.Controller;

import com.fdp.datareport.Entity.Sprint;
import com.fdp.datareport.Service.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class SprintController {

    @Autowired
    private SprintService sprintService;

    // 🔹 Create Sprint
    @PostMapping("/{projectId}/sprints")
    public ResponseEntity<Sprint> createSprint(@PathVariable Long projectId, @RequestBody Sprint sprint) {
        try {
            Sprint created = sprintService.createSprint(projectId, sprint);
            return ResponseEntity.status(201).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 🔹 Get All Sprints by Project
    @GetMapping("/{projectId}/sprints")
    public ResponseEntity<List<Sprint>> getSprintsByProject(@PathVariable Long projectId) {
        List<Sprint> sprints = sprintService.getSprintsByProject(projectId);
        return ResponseEntity.ok(sprints);
    }

    // 🔹 Get Sprint by ID
    @GetMapping("/sprints/{sprintId}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable Long sprintId) {
        try {
            Sprint sprint = sprintService.getSprintById(sprintId);
            return ResponseEntity.ok(sprint);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔹 Update Sprint
    @PutMapping("/sprints/{sprintId}")
    public ResponseEntity<Sprint> updateSprint(@PathVariable Long sprintId, @RequestBody Sprint sprint) {
        try {
            Sprint updated = sprintService.updateSprint(sprintId, sprint);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔹 Delete Sprint
    @DeleteMapping("/sprints/{sprintId}")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long sprintId) {
        try {
            sprintService.deleteSprint(sprintId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
