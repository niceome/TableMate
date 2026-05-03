package com.example.TableMate.dto.request;

import com.example.TableMate.domain.enums.Cafeteria;
import com.example.TableMate.domain.enums.FoodType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class UpdatePostRequest {

    private Cafeteria cafeteria;
    private FoodType foodType;
    private LocalTime meetingTime;
    private Integer maxParticipants;
    private String content;
}
