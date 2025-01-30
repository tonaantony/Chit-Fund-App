package com.chitfund.groupservice.dto;

// public class ChitPlanDTO {

//     private int month;
//     private Double amount;
//     private Double commission;
//     private Double amountGiven;

//     public ChitPlanDTO(int month, Double amount, Double commission, Double amountGiven) {
//         this.month = month;
//         this.amount = amount;
//         this.commission = commission;
//         this.amountGiven = amountGiven;
//     }

//     public int getMonth() {
//         return month;
//     }

//     public void setMonth(int month) {
//         this.month = month;
//     }

//     public Double getAmount() {
//         return amount;
//     }

//     public void setAmount(Double amount) {
//         this.amount = amount;
//     }

//     public Double getCommission() {
//         return commission;
//     }

//     public void setCommission(Double commission) {
//         this.commission = commission;
//     }

//     public Double getAmountGiven() {
//         return amountGiven;
//     }

//     public void setAmountGiven(Double amountGiven) {
//         this.amountGiven = amountGiven;
//     }

//     // Getters and setters
    
// }



public class ChitPlanDTO {
    private int month;
    private double poolAmount;
    private double commission;
    private double winningBid;
    private double discount;
    private double discountPerMember;

    // Constructor
    public ChitPlanDTO(int month, double poolAmount, double commission, double winningBid, double discount, double discountPerMember) {
        this.month = month;
        this.poolAmount = poolAmount;
        this.commission = commission;
        this.winningBid = winningBid;
        this.discount = discount;
        this.discountPerMember = discountPerMember;
    }

    // Getters and Setters
    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public double getPoolAmount() {
        return poolAmount;
    }

    public void setPoolAmount(double poolAmount) {
        this.poolAmount = poolAmount;
    }

    public double getCommission() {
        return commission;
    }

    public void setCommission(double commission) {
        this.commission = commission;
    }

    public double getWinningBid() {
        return winningBid;
    }

    public void setWinningBid(double winningBid) {
        this.winningBid = winningBid;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public double getDiscountPerMember() {
        return discountPerMember;
    }

    public void setDiscountPerMember(double discountPerMember) {
        this.discountPerMember = discountPerMember;
    }

    @Override
    public String toString() {
        return "ChitPlanDTO{" +
                "month=" + month +
                ", poolAmount=" + poolAmount +
                ", commission=" + commission +
                ", winningBid=" + winningBid +
                ", discount=" + discount +
                ", discountPerMember=" + discountPerMember +
                '}';
    }
}


