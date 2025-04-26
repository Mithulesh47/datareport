package com.fdp.datareport.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sprintName;

    @Temporal(TemporalType.DATE)
    private Date sprintStartDate;

    @Temporal(TemporalType.DATE)
    private Date sprintEndDate;

    private String sprintJira;

    @Column(length = 1000)
    private String sprintDescription;

    private String assignedTo;

    // Many sprints can be for one status
    @ManyToOne
    @JoinColumn(name = "status_id")
    private Status sprintFor;

    // Many sprints can be linked to one project
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}
