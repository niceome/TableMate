package com.example.TableMate.dto.response;

import com.example.TableMate.domain.entity.Application;
import com.example.TableMate.domain.enums.ApplicationStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ApplicantResponse {

    private final Long applicationId;
    private final Long applicantId;
    private final String applicantName;
    private final String applicantUsername;
    private final ApplicationStatus status;
    private final LocalDateTime appliedAt;

    public ApplicantResponse(Application application) {
        this.applicationId = application.getId();
        this.applicantId = application.getApplicant().getId();
        this.applicantName = application.getApplicant().getName();
        this.applicantUsername = application.getApplicant().getUsername();
        this.status = application.getStatus();
        this.appliedAt = application.getAppliedAt();
    }
}
