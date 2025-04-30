package com.fdp.datareport.Repository;

import com.fdp.datareport.Entity.ScrumArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScrumAreaRepository extends JpaRepository<ScrumArea, Long> {
}
