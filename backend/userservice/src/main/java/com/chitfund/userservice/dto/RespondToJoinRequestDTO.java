package com.chitfund.userservice.dto;

// import jakarta.validation.constraints.NotNull;
// import jakarta.validation.constraints.Pattern;

// public class RespondToJoinRequestDTO {
//     @NotNull(message = "Action is required")
//     @Pattern(regexp = "accept|reject", message = "Action must be either 'accept' or 'reject'")
//     private String action;

//     // Getters and Setters
//     public String getAction() {
//         return action;
//     }

//     public void setAction(String action) {
//         this.action = action;
//     }
// }

// In RespondToJoinRequestDTO.java

public class RespondToJoinRequestDTO {

    private String action; // accept or decline
    private String organizerId; // the organizer who is accepting the request

    // Getters and Setters

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(String organizerId) {
        this.organizerId = organizerId;
    }
}
