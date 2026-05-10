package com.geraldobuseh.transactionservice.audit.dto;

import java.util.List;

public class TransactionHistoryResponse {

    private Long transactionId;
    private List<AuditEventResponse> events;

    public TransactionHistoryResponse(Long transactionId, List<AuditEventResponse> events) {
        this.transactionId = transactionId;
        this.events = events;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public List<AuditEventResponse> getEvents() {
        return events;
    }

    public void setEvents(List<AuditEventResponse> events) {
        this.events = events;
    }
}
