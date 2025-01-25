package com.chitfund.userservice.dto;

import jakarta.validation.constraints.NotNull;

public class AddGroupDTO {
    @NotNull(message = "Group ID is required")
    private String groupId;

    // Getters and Setters
    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }
}

