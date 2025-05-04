package com.fdp.datareport.entities;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Calendar;
import java.util.Date;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class ProjectTest {

    private Validator validator;
    private Area dummyArea;
    private Status dummyStatus;

    @BeforeEach
    public void setup() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        dummyArea = new Area(1L, "Development", "Alice", "alice@example.com");
        dummyStatus = new Status(1L, "In Progress", 50);
    }

    private Date getDate(int year, int month, int day) {
        Calendar cal = Calendar.getInstance();
        cal.set(year, month - 1, day);
        return cal.getTime();
    }

    @Test
    public void testValidProject() {
        Project project = new Project(
                1L,
                "Project Alpha",
                "Backend revamp",
                "John Doe",
                "JIRA-123",
                dummyArea,
                dummyStatus,
                getDate(2024, 5, 1),
                getDate(2024, 5, 10)
        );

        Set<ConstraintViolation<Project>> violations = validator.validate(project);
        assertTrue(violations.isEmpty(), "Valid project should have no violations");
    }

    @Test
    public void testMissingFields() {
        Project project = new Project(); // All fields null
        Set<ConstraintViolation<Project>> violations = validator.validate(project);

        violations.forEach(v -> System.out.println(v.getPropertyPath() + ": " + v.getMessage()));

        assertEquals(5, violations.size(), "Expected violations for projectName, developer, jira, startDate, endDate");
    }

    @Test
    public void testInvalidDateRange() {
        Project project = new Project(
                1L,
                "Project Beta",
                "Frontend upgrade",
                "Jane Doe",
                "JIRA-456",
                dummyArea,
                dummyStatus,
                getDate(2024, 5, 10), // startDate
                getDate(2024, 5, 1)   // endDate (invalid)
        );

        Set<ConstraintViolation<Project>> violations = validator.validate(project);
        violations.forEach(v -> System.out.println(v.getPropertyPath() + ": " + v.getMessage()));

        assertEquals(1, violations.size(), "Should detect one date range violation");

        assertTrue(violations.stream().anyMatch(v ->
                v.getMessage().equals("Start date must not be after end date")
        ));
    }

    @Test
    public void testNullDatesStillValidForRangeValidator() {
        Project project = new Project(
                1L,
                "Project Gamma",
                "No dates provided",
                "Dev",
                "JIRA-789",
                dummyArea,
                dummyStatus,
                null,
                null
        );

        Set<ConstraintViolation<Project>> violations = validator.validate(project);
        violations.forEach(v -> System.out.println(v.getPropertyPath() + ": " + v.getMessage()));

        // Should be 2 violations from @NotNull on startDate and endDate
        assertEquals(2, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("startDate")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("endDate")));
    }
}
