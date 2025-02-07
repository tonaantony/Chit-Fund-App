package com.chitfund.groupservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.chitfund.groupservice.dto.ChitPlanDTO;
import com.chitfund.groupservice.dto.Transaction;
import com.chitfund.groupservice.dto.UserDTO;
import com.chitfund.groupservice.model.Group;
import com.chitfund.groupservice.repository.GroupRepository;

import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    private final String USER_SERVICE_BASE_URL = "http://localhost:8082/api/users";
    private final String TRANSACTION_SERVICE_BASE_URL = "http://localhost:8084/api/transactions";



    // Create a new group
    public Group createGroup(Group group) {
        group.setGroupId(generateGroupId());
        return groupRepository.save(group);
    }

    private String generateGroupId() {
        return "G" + String.format("%04d", (int) (Math.random() * 1000));
    }

    // Get all groups
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    // Get group by ID
    public Group getGroupById(String groupId) {
        return groupRepository.findByGroupId(groupId).get();
    }

    public Group getGroupByName(String groupName) {
        return groupRepository.findByGroupName(groupName).get();
    }

    public List<Group> getGroupsByOrganizerId(String organizerId){
        return groupRepository.findByOrganizerId(organizerId);
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

    public boolean acceptJoinRequest(String groupId, String userId) {
        Group group = groupRepository.findByGroupId(groupId).orElseThrow(() -> new RuntimeException("Group not found"));

        // Check if the user is in the join requests list
        if (group.getJoinRequests().contains(userId)) {
            group.getJoinRequests().remove(userId); // Remove the user from join requests
            group.getParticipants().add(userId); // Add the user to participants
            groupRepository.save(group); // Save the group with updated participants

            // Optionally, log a transaction here
            Transaction transaction = new Transaction();
            transaction.setUserId(userId);
            transaction.setGroupId(groupId);
            transaction.setTransactionType("GROUP_JOIN");

            // Log the transaction to transaction service
            webClientBuilder.baseUrl("http://localhost:8082")
                .build()
                .post()
                .uri("/api/users")
                .bodyValue(transaction)
                .retrieve()
                .onStatus(status -> status.is5xxServerError(), response -> Mono.error(new RuntimeException("Transaction creation failed")))
                .bodyToMono(Void.class)
                .block();

            return true; // Successfully added user to group
        }

        return false; // User is not in the join requests list
    }


    public boolean addParticipant(String groupId, String userId, String organizerId) {
        // Fetch the group from the repository
        Group group = groupRepository.findByGroupId(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    
        // Ensure that the organizer is the one adding the participant
        if (!group.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Only the organizer can add participants");
        }
    
        // Ensure the user has a pending join request
        if (!group.getJoinRequests().contains(userId)) {
            throw new RuntimeException("User has not requested to join this group");
        }
    
        // Add the user to the group participants
        group.getParticipants().add(userId);
        group.getJoinRequests().remove(userId); // Remove the user from pending join requests
    
        // Save the updated group to the repository
        groupRepository.save(group);
    
        return true; // Indicate success
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
        Double poolAmount = totalAmount;
        Double commissionAmount = poolAmount * (commission / 100);
        Double availableForBidding = poolAmount - commissionAmount;
        for (int month = 1; month <= months; month++) {
            // Simulate an auction: assume the winning bid is slightly less each month
            // Double winningBid = poolAmount - (Math.round(Math.random() * (poolAmount * 0.1))); // Randomly deduct 10% max
            Double winningBid = (double) Math.round(Math.random() * availableForBidding);
            Double discount = poolAmount - commissionAmount - winningBid;
    
            // Split the discount among all members
            Double discountPerMember = discount / members;
    
            chitPlans.add(new ChitPlanDTO(month, poolAmount, commissionAmount, winningBid, discount, discountPerMember));
        }
    
        return chitPlans;
    }
    
    public Map<String, Object> displayMonthlyPlan(String groupId, Double totalAmount, Integer duration, Double interest) {
        Group group = getGroupById(groupId);
        if (totalAmount <= 0 || duration <= 0) {
            throw new IllegalArgumentException("Invalid totalAmount or duration");
        }

        List<ChitPlanDTO> results = calculateChit(totalAmount, duration, duration, interest);
        List<String> userNames = getParticipants(groupId);

        Collections.shuffle(userNames);
        List<String> monthlyDraw = new ArrayList<>();
        for (int i = 0; i < results.size(); i++) {
            monthlyDraw.add(userNames.get(i % userNames.size()));
        }

        group.setMonthlyDraw(monthlyDraw);
        groupRepository.save(group);

        Map<String, Object> response = new HashMap<>();
        response.put("results", results);
        response.put("monthlyDraw", monthlyDraw);
        return response;
    }
    

}
