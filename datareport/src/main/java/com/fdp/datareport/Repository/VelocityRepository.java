package com.fdp.datareport.Repository;

import com.fdp.datareport.Entity.Velocity;
import com.fdp.datareport.Entity.ScrumArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VelocityRepository extends JpaRepository<Velocity, Long> {
    List<Velocity> findByScrumAreaId(Long areaId);


    List<Velocity> findTop3ByScrumAreaOrderBySprintEndDateDesc(ScrumArea scrumArea);
}
