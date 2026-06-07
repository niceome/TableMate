package com.example.TableMate.domain.repository;

import com.example.TableMate.domain.entity.Post;
import com.example.TableMate.domain.enums.Cafeteria;
import com.example.TableMate.domain.enums.FoodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("""
            select p from Post p
            where (:cafeteria is null or p.cafeteria = :cafeteria)
              and (:foodType is null or p.foodType = :foodType)
              and (:meetingTime is null or p.meetingTime = :meetingTime)
            """)
    List<Post> findByFilters(
            @Param("cafeteria") Cafeteria cafeteria,
            @Param("foodType") FoodType foodType,
            @Param("meetingTime") LocalTime meetingTime);
}
