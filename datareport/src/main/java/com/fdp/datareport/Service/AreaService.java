package com.fdp.datareport.Service;

import com.fdp.datareport.Entity.Area;
import com.fdp.datareport.Entity.Project;
import com.fdp.datareport.Repository.AreaRepository;
import com.fdp.datareport.Repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AreaService {

    @Autowired
    private AreaRepository areaRepo;

    @Autowired
    private ProjectRepository projectRepository;

    // Get all areas
    public List<Area> getAllAreas() {
        return areaRepo.findAll();
    }

    // Get area by ID
    public Optional<Area> getAreaById(Long id) {
        return areaRepo.findById(id);
    }

    // Add a new area
    public Area addArea(Area area) {
        return areaRepo.save(area);
    }

    // Update an area
    public Area updateArea(Long id, Area updatedArea) {
        if (areaRepo.existsById(id)) {
            updatedArea.setId(id);
            return areaRepo.save(updatedArea);
        } else {
            return null;
        }
    }

    // Delete an area
    @Transactional
    public boolean deleteArea(Long id) {
        Optional<Area> areaOpt = areaRepo.findById(id);
        if (areaOpt.isPresent()) {
            // Update Projects to set area to null
            List<Project> projects = projectRepository.findByArea(areaOpt.get());
            for (Project project : projects) {
                project.setArea(null);
                projectRepository.save(project);
            }
            areaRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
