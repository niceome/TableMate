package com.example.TableMate.dto.request;

import com.example.TableMate.domain.enums.Cafeteria;
import com.example.TableMate.domain.enums.FoodType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class CreatePostRequest {

    @NotNull
    private Cafeteria cafeteria;

    @NotNull
    private FoodType foodType;

    @NotNull
    private LocalTime meetingTime;

    @Min(2)
    private int maxParticipants;

    @NotBlank
    private String content;
}
