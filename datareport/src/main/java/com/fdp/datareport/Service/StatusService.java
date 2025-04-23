package com.fdp.datareport.Service;

import com.fdp.datareport.Entity.Project;
import com.fdp.datareport.Entity.Status;
import com.fdp.datareport.Repository.StatusRepository;
import com.fdp.datareport.Repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StatusService {

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // Get all statuses
    public List<Status> getAllStatuses() {
        return statusRepository.findAll();
    }

    // Get a status by ID
    public Optional<Status> getStatusById(Long id) {
        return statusRepository.findById(id);
    }

    // Create a new status
    public Status createStatus(Status status) {
        return statusRepository.save(status);
    }

    // Update an existing status
    public Status updateStatus(Long id, Status updatedStatus) {
        return statusRepository.findById(id)
                .map(existingStatus -> {
                    existingStatus.setStatusName(updatedStatus.getStatusName());
                    existingStatus.setPercentage(updatedStatus.getPercentage());
                    return statusRepository.save(existingStatus);
                })
                .orElseThrow(() -> new RuntimeException("Status not found with id " + id));
    }

    // Delete a status
    @Transactional
    public boolean deleteStatus(Long id) {
        Optional<Status> statusOpt = statusRepository.findById(id);
        if (statusOpt.isPresent()) {
            // Update Projects to set status to null
            List<Project> projects = projectRepository.findByStatus(statusOpt.get());
            for (Project project : projects) {
                project.setStatus(null);
                projectRepository.save(project);
            }
            statusRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
