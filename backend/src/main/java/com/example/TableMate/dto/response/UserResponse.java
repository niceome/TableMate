package com.example.TableMate.dto.response;

import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.domain.enums.FoodType;
import lombok.Getter;

import java.util.Set;

@Getter
public class UserResponse {
    private final Long id;
    private final String name;
    private final String username;
    private final Set<FoodType> foodPreferences;

    public UserResponse(Member member) {
        this.id = member.getId();
        this.name = member.getName();
        this.username = member.getUsername();
        this.foodPreferences = member.getFoodPreferences();
    }
}
