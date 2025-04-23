package com.fdp.datareport.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectName;
    private String description;
    private String developer;
    private String jira;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "area_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Area area;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Status status;


    private Date startDate;
    private Date endDate;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeveloper() {
        return developer;
    }

    public void setDeveloper(String developer) {
        this.developer = developer;
    }

    public String getJira() {
        return jira;
    }

    public void setJira(String jira) {
        this.jira = jira;
    }

    public Area getArea() {
        return area;
    }

    public void setArea(Area area) {
        this.area = area;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    // This method is invoked before a Project is deleted
    @PreRemove
    private void onDelete() {
        if (this.area != null) {
            this.area = null; // set the area to null before deleting the Project
        }
        if (this.status != null) {
            this.status = null; // set the status to null before deleting the Project
        }
    }
}
