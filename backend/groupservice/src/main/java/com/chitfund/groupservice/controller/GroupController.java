package com.chitfund.groupservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chitfund.groupservice.dto.AddParticipantDTO;
import com.chitfund.groupservice.dto.ChitCalculationDTO;
import com.chitfund.groupservice.dto.ChitPlanDTO;
import com.chitfund.groupservice.dto.JoinRequestDTO;
import com.chitfund.groupservice.model.Group;
import com.chitfund.groupservice.service.GroupService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin()
public class GroupController {

    @Autowired
    private GroupService groupService;

    // Create a new group
    @PostMapping
    public Group createGroup(@RequestBody Group group) {
        return groupService.createGroup(group);
    }

    // Get all groups
    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    // Get a group by ID
    @GetMapping("/{groupId}")
    public Group getGroupById(@PathVariable String groupId) {
        return groupService.getGroupById(groupId);
    }

    @GetMapping("/organizer/{organizerId}")
    public List<Group> getGroupsByOrganizer(@PathVariable String organizerId) {
        List<Group> groups = groupService.getGroupsByOrganizerId(organizerId);
        return groups;
    }

    // Update group details
    @PutMapping("/{groupId}")
    public Group updateGroup(@PathVariable String groupId, @RequestBody Group groupDetails) {
        return groupService.updateGroup(groupId, groupDetails);
    }

    // Delete a group by name
    @DeleteMapping("/{groupName}")
    public String deleteGroup(@PathVariable String groupName) {
        groupService.deleteGroup(groupName);
        return "Group deleted successfully";
    }

    // Request to join a group
    @PostMapping("/join")
    public String requestToJoin(@RequestBody JoinRequestDTO joinRequestDTO) {
        boolean success = groupService.requestToJoinGroup(joinRequestDTO.getGroupId(), joinRequestDTO.getUserId());
        if (success) {
            return "Join request sent successfully";
        }
        return "Join request failed";
    }

    @PostMapping("/{groupId}/add-participant")
    public ResponseEntity<?> addParticipant(
        @PathVariable String groupId, 
        @RequestBody AddParticipantDTO addParticipantDTO, 
        @RequestHeader("X-User-Id") String organizerId) {
        try {
            boolean success = groupService.addParticipant(groupId, addParticipantDTO.getUserId(), organizerId);
            if (success) {
                return ResponseEntity.ok("Participant added successfully");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to add participant");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // Add the endpoint to accept a join request
    @PostMapping("/{groupId}/accept-join/{userId}")
    public ResponseEntity<?> acceptJoinRequest(
        @PathVariable String groupId,
        @PathVariable String userId) {
        
        try {
            boolean success = groupService.acceptJoinRequest(groupId, userId);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "User added to the group successfully"));
            } else {
                return ResponseEntity.status(400).body(Map.of("message", "User not in join request list"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }


    // Get participants of a group
    @GetMapping("/{groupId}/participants")
    public List<String> getParticipants(@PathVariable String groupId) {
        return groupService.getParticipants(groupId);
    }

    // Calculate Chit Plan
    @PostMapping("/calculate-chit")
    public List<ChitPlanDTO> calculateChit(@RequestBody ChitCalculationDTO chitCalculationDTO) {
        return groupService.calculateChit(chitCalculationDTO.getTotalAmount(), chitCalculationDTO.getMonths(),
                chitCalculationDTO.getMembers(), chitCalculationDTO.getCommission());
    }
}
