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

    // Cascade delete for Area, meaning when an Area is deleted, all Projects related to that Area will be deleted
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "area_id")
    @OnDelete(action = OnDeleteAction.CASCADE) // Automatically delete projects when the Area is deleted
    private Area area;

    // Set Status to null when Status is deleted
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    @OnDelete(action = OnDeleteAction.SET_NULL) // Set Status to null when the Status is deleted
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
        // The cascading behavior for Area and Status is already handled by annotations
        // No need to do manual nullification here for cascading delete or nullification
    }
}
