package com.fdp.datareport.Repository;


import com.fdp.datareport.Entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status, Long> {
}

