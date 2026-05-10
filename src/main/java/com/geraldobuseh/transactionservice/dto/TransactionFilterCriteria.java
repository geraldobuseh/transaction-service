package com.geraldobuseh.transactionservice.dto;

import java.math.BigDecimal;

public class TransactionFilterCriteria {

    private String status;
    private String type;
    private String userId;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;

    public TransactionFilterCriteria(
            String status,
            String type,
            String userId,
            BigDecimal minAmount,
            BigDecimal maxAmount
    ) {
        this.status = status;
        this.type = type;
        this.userId = userId;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
    }

    public String getStatus() {
        return status;
    }

    public String getType() {
        return type;
    }

    public String getUserId() {
        return userId;
    }

    public BigDecimal getMinAmount() {
        return minAmount;
    }

    public BigDecimal getMaxAmount() {
        return maxAmount;
    }
}
