package com.example.TableMate.dto.response;

import com.example.TableMate.domain.entity.Application;
import com.example.TableMate.domain.enums.ApplicationStatus;
import com.example.TableMate.domain.enums.FoodType;
import lombok.Getter;

import java.util.Set;

@Getter
public class ApplicantResponse {
    private final Long id;
    private final String name;
    private final Set<FoodType> foodPreferences;
    private final ApplicationStatus status;

    public ApplicantResponse(Application application) {
        this.id = application.getApplicant().getId();
        this.name = application.getApplicant().getName();
        this.foodPreferences = application.getApplicant().getFoodPreferences();
        this.status = application.getStatus();
    }
}
