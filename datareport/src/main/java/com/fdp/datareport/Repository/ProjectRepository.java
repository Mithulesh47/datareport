package com.fdp.datareport.Repository;


import com.fdp.datareport.Entity.Area;
import com.fdp.datareport.Entity.Project;
import com.fdp.datareport.Entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByArea(Area area);
    List<Project> findByStatus(Status status);
}
