package com.example.TableMate.dto.request;

import com.example.TableMate.domain.enums.FoodType;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UpdateUserRequest {
    private String name;
    private Set<FoodType> foodPreferences;
}
