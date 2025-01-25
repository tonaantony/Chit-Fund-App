package com.chitfund.groupservice.dto;

public class ChitPlanDTO {

    private int month;
    private Double amount;
    private Double commission;
    private Double amountGiven;

    public ChitPlanDTO(int month, Double amount, Double commission, Double amountGiven) {
        this.month = month;
        this.amount = amount;
        this.commission = commission;
        this.amountGiven = amountGiven;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getCommission() {
        return commission;
    }

    public void setCommission(Double commission) {
        this.commission = commission;
    }

    public Double getAmountGiven() {
        return amountGiven;
    }

    public void setAmountGiven(Double amountGiven) {
        this.amountGiven = amountGiven;
    }

    // Getters and setters
    
}

