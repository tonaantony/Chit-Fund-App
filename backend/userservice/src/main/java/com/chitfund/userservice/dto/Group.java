package com.chitfund.userservice.dto;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;

public class Group {
    private String groupId;
    private String groupName;
    private String groupType;
    private Integer interest;
    private String organizerId;
    private Integer members;
    private Integer duration;
    private Double totalAmount;
    private Double ticketValue;
    private List<String> participants;
    private List<String> joinRequests;
    private List<String> monthlyDraw;
    private String description;
    public String getGroupId() {
        return groupId;
    }
    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }
    public String getGroupName() {
        return groupName;
    }
    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }
    public String getGroupType() {
        return groupType;
    }
    public void setGroupType(String groupType) {
        this.groupType = groupType;
    }
    public Integer getInterest() {
        return interest;
    }
    public void setInterest(Integer interest) {
        this.interest = interest;
    }
    public String getOrganizerId() {
        return organizerId;
    }
    public void setOrganizerId(String organizerId) {
        this.organizerId = organizerId;
    }
    public Integer getMembers() {
        return members;
    }
    public void setMembers(Integer members) {
        this.members = members;
    }
    public Integer getDuration() {
        return duration;
    }
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    public Double getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    public Double getTicketValue() {
        return ticketValue;
    }
    public void setTicketValue(Double ticketValue) {
        this.ticketValue = ticketValue;
    }
    public List<String> getParticipants() {
        return participants;
    }
    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }
    public List<String> getJoinRequests() {
        return joinRequests;
    }
    public void setJoinRequests(List<String> joinRequests) {
        this.joinRequests = joinRequests;
    }
    public List<String> getMonthlyDraw() {
        return monthlyDraw;
    }
    public void setMonthlyDraw(List<String> monthlyDraw) {
        this.monthlyDraw = monthlyDraw;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    
}

