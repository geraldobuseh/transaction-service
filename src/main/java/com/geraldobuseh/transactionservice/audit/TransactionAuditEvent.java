package com.geraldobuseh.transactionservice.audit;

import com.geraldobuseh.transactionservice.entity.Transaction;
import com.geraldobuseh.transactionservice.entity.TransactionStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "transaction_audit_events",
        indexes = {
                @Index(name = "idx_transaction_audit_transaction_id", columnList = "transaction_id"),
                @Index(name = "idx_transaction_audit_performed_by", columnList = "performed_by"),
                @Index(name = "idx_transaction_audit_created_at", columnList = "created_at")
        }
)
public class TransactionAuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", nullable = false)
    private Long transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "transaction_id",
            nullable = false,
            insertable = false,
            updatable = false,
            foreignKey = @ForeignKey(name = "fk_transaction_audit_transaction")
    )
    private Transaction transaction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AuditEventType eventType;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private TransactionStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private TransactionStatus newStatus;

    @Column(nullable = false, length = 150)
    private String performedBy;

    @Column(nullable = false, length = 50)
    private String performedByRole;

    @Column(nullable = false, length = 500)
    private String eventDescription;

    @Column(length = 255)
    private String ruleTriggered;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public Transaction getTransaction() {
        return transaction;
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
}
