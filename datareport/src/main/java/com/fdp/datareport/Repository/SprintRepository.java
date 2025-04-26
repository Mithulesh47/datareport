package com.fdp.datareport.Repository;

import com.fdp.datareport.Entity.Sprint;
import com.fdp.datareport.Entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    int deleteByProject(Project p);

}

