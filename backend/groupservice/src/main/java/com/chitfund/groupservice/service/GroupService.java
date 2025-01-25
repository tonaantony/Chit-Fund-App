package com.chitfund.groupservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chitfund.groupservice.dto.ChitPlanDTO;
import com.chitfund.groupservice.model.Group;
import com.chitfund.groupservice.repository.GroupRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    // Create a new group
    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    // Get all groups
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    // Get group by ID
    public Group getGroupById(String groupId) {
        return groupRepository.findByGroupId(groupId).get();
    }

    // Update group details
    public Group updateGroup(String groupId, Group groupDetails) {
        Group group = groupRepository.findByGroupId(groupId).get();
        if (group != null) {
            group.setGroupName(groupDetails.getGroupName());
            group.setGroupType(groupDetails.getGroupType());
            group.setInterest(groupDetails.getInterest());
            group.setMembers(groupDetails.getMembers());
            group.setDuration(groupDetails.getDuration());
            group.setTotalAmount(groupDetails.getTotalAmount());
            group.setTicketValue(groupDetails.getTicketValue());
            group.setDescription(groupDetails.getDescription());
            return groupRepository.save(group);
        }
        return null;
    }

    // Delete group by name
    public void deleteGroup(String groupName) {
        Group group = groupRepository.findByGroupName(groupName).get();
        if (group != null) {
            groupRepository.delete(group);
        }
    }

    // Handle joining request
    public boolean requestToJoinGroup(String groupId, String userId) {
        Group group = groupRepository.findByGroupId(groupId).get();
        if (group != null) {
            if (!group.getJoinRequests().contains(userId)) {
                group.getJoinRequests().add(userId);
                groupRepository.save(group);
                return true;
            }
        }
        return false;
    }

    // Handle adding participant
    public boolean addParticipant(String groupId, String userId, String organizerId) {
        Group group = groupRepository.findByGroupId(groupId).get();
        if (group != null && group.getOrganizerId().equals(organizerId)) {
            if (group.getJoinRequests().contains(userId)) {
                group.getParticipants().add(userId);
                group.getJoinRequests().remove(userId);
                groupRepository.save(group);
                return true;
            }
        }
        return false;
    }

    // Get participants of a group
    public List<String> getParticipants(String groupId) {
        Group group = groupRepository.findByGroupId(groupId).get();
        if (group != null) {
            return group.getParticipants();
        }
        return null;
    }

    // Calculate Chit Plan
    public List<ChitPlanDTO> calculateChit(Double totalAmount, Integer months, Integer members, Double commission) {
        List<ChitPlanDTO> chitPlans = new ArrayList<>();
        Double minAmount = totalAmount / members;
        Double interest = (double) months / 200;
        Double commissionAmount;
        Double amountGiven;

        for (int month = 1; month <= months; month++) {
            commissionAmount = minAmount * commission / 100;
            amountGiven = minAmount - commissionAmount;

            chitPlans.add(new ChitPlanDTO(month, minAmount, commissionAmount, amountGiven));

            minAmount += 0.01 * totalAmount; // Update amount for the next month
        }

        return chitPlans;
    }

}

