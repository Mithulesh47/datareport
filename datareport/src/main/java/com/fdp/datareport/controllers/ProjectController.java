package com.fdp.datareport.controllers;

import com.fdp.datareport.entities.Project;
import com.fdp.datareport.services.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@Validated
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // Create a new project
    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody Project project) {
        return ResponseEntity.ok(projectService.createProject(project));
    }

    // Get all projects
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // Get project by id
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectService.getProjectById(id);
        return project.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a project
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @Valid @RequestBody Project project) {
        Optional<Project> updatedProject = projectService.updateProject(id, project);
        return updatedProject.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (projectService.deleteProject(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
