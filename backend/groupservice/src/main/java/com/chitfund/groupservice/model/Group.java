package com.chitfund.groupservice.model;

import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "`group`")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "group_id", unique = true, nullable = false)
    private String groupId;

    @Column(name = "group_name", unique = true, nullable = false)
    private String groupName;

    @Column(name = "group_type", nullable = false)
    private String groupType;

    @Column(name = "interest", nullable = false)
    private Integer interest;

    @Column(name = "organizer_id", nullable = false)
    private String organizerId;

    @Column(name = "members", nullable = false)
    private Integer members;

    @Column(name = "duration", nullable = false)
    private Integer duration;

    
    @Column(name = "start_date", nullable = false)
    private Date startDate;

    
    @Column(name = "end_date", nullable = false)
    private Date endDate;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "ticket_value", nullable = false)
    private Double ticketValue;

    @ElementCollection
    private List<String> participants;

    @ElementCollection
    private List<String> joinRequests;

    @ElementCollection
    private List<String> monthlyDraw;

    @Column(name = "description", nullable = false)
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
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

