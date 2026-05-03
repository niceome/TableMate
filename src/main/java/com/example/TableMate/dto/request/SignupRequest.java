package com.example.TableMate.dto.request;

import com.example.TableMate.domain.enums.FoodType;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class SignupRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    private Set<FoodType> foodPreferences = new HashSet<>();
}
