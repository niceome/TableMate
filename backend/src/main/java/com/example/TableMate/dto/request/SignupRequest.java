package com.example.TableMate.dto.request;

import com.example.TableMate.domain.enums.FoodType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

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

    @NotEmpty
    private Set<FoodType> foodPreferences;
}
