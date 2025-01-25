package com.chitfund.userservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class RespondToJoinRequestDTO {
    @NotNull(message = "Action is required")
    @Pattern(regexp = "accept|reject", message = "Action must be either 'accept' or 'reject'")
    private String action;

    // Getters and Setters
    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}

