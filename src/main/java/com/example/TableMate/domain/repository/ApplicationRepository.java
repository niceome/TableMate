package com.example.TableMate.domain.repository;

import com.example.TableMate.domain.entity.Application;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.domain.entity.Post;
import com.example.TableMate.domain.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByPostAndApplicant(Post post, Member applicant);
    List<Application> findAllByPost(Post post);
    Optional<Application> findByPostAndApplicantId(Post post, Long applicantId);
    long countByPostAndStatus(Post post, ApplicationStatus status);
}
