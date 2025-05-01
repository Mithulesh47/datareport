package com.fdp.datareport.controllers;

import com.fdp.datareport.entities.Status;
import com.fdp.datareport.services.StatusService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statuses")
@CrossOrigin(origins = "*")
public class StatusController {

    @Autowired
    private StatusService statusService;

    // Get all statuses
    @GetMapping
    public ResponseEntity<List<Status>> getAllStatuses() {
        List<Status> statuses = statusService.getAllStatuses();
        return ResponseEntity.ok(statuses);
    }

    // Get a status by ID
    @GetMapping("/{id}")
    public ResponseEntity<Status> getStatusById(@PathVariable Long id) {
        return statusService.getStatusById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Add a new status
    @PostMapping
    public ResponseEntity<Status> addStatus(@Valid @RequestBody Status status) {
        Status createdStatus = statusService.createStatus(status);  // Updated to match service method name
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStatus);
    }

    // Update an existing status
    @PutMapping("/{id}")
    public ResponseEntity<Status> updateStatus(@PathVariable Long id,@Valid @RequestBody Status status) {
        Status updatedStatus = statusService.updateStatus(id, status);
        return updatedStatus != null
                ? ResponseEntity.ok(updatedStatus)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    // Delete a status
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatus(@PathVariable Long id) {
        if (statusService.deleteStatus(id)) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found
        }
    }
}
