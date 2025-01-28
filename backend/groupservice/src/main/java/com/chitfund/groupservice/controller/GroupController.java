package com.chitfund.groupservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.chitfund.groupservice.dto.AddParticipantDTO;
import com.chitfund.groupservice.dto.ChitCalculationDTO;
import com.chitfund.groupservice.dto.ChitPlanDTO;
import com.chitfund.groupservice.dto.JoinRequestDTO;
import com.chitfund.groupservice.model.Group;
import com.chitfund.groupservice.service.GroupService;

import java.util.List;

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

    // Add participant to the group (only the organizer can do this)
    @PostMapping("/{groupId}/add-participant")
    public String addParticipant(@PathVariable String groupId, @RequestBody AddParticipantDTO addParticipantDTO,
                                 @RequestHeader("X-User-Id") String organizerId) {
        boolean success = groupService.addParticipant(groupId, addParticipantDTO.getUserId(), organizerId);
        if (success) {
            return "Participant added successfully";
        }
        return "Failed to add participant";
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

