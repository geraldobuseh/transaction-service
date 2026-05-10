package com.geraldobuseh.transactionservice.audit.dto;

import com.geraldobuseh.transactionservice.audit.AuditEventType;
import com.geraldobuseh.transactionservice.entity.TransactionStatus;

import java.time.LocalDateTime;

public class AuditEventResponse {

    private Long id;
    private Long transactionId;
    private AuditEventType eventType;
    private TransactionStatus previousStatus;
    private TransactionStatus newStatus;
    private String performedBy;
    private String performedByRole;
    private String eventDescription;
    private String ruleTriggered;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public AuditEventType getEventType() {
        return eventType;
    }

    public void setEventType(AuditEventType eventType) {
        this.eventType = eventType;
    }

    public TransactionStatus getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(TransactionStatus previousStatus) {
        this.previousStatus = previousStatus;
    }

    public TransactionStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(TransactionStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public String getPerformedByRole() {
        return performedByRole;
    }

    public void setPerformedByRole(String performedByRole) {
        this.performedByRole = performedByRole;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public String getRuleTriggered() {
        return ruleTriggered;
    }

    public void setRuleTriggered(String ruleTriggered) {
        this.ruleTriggered = ruleTriggered;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
