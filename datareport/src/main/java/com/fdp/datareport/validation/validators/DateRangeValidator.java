package com.fdp.datareport.validation.validators;

import com.fdp.datareport.validation.annotations.ValidDateRange;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.lang.reflect.Field;
import java.util.Date;

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, Object> {

    private String startFieldName;
    private String endFieldName;

    @Override
    public void initialize(ValidDateRange constraintAnnotation) {
        this.startFieldName = constraintAnnotation.startField();
        this.endFieldName = constraintAnnotation.endField();
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        try {
            Field startField = obj.getClass().getDeclaredField(startFieldName);
            Field endField = obj.getClass().getDeclaredField(endFieldName);

            startField.setAccessible(true);
            endField.setAccessible(true);

            Object startObj = startField.get(obj);
            Object endObj = endField.get(obj);

            if (startObj == null || endObj == null) {
                return true; // Let @NotNull handle nulls
            }

            if (!(startObj instanceof Date) || !(endObj instanceof Date)) {
                return false;
            }

            Date startDate = (Date) startObj;
            Date endDate = (Date) endObj;
            if (startDate.after(endDate)) {
                // Add the custom error message to the validation context
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Start date must be before end date")
                        .addPropertyNode(startFieldName) // Optional: mark the specific field in the error message
                        .addConstraintViolation();
                return false;
            }

            System.out.println(startDate.before(endDate));
            return startDate.before(endDate);
        } catch (Exception e) {
            return false; // Invalid if reflection fails
        }
    }
}
