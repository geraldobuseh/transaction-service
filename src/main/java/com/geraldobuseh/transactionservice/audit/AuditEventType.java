package com.geraldobuseh.transactionservice.audit;

public enum AuditEventType {
    TRANSACTION_CREATED,
    RULE_EVALUATED,
    STATUS_CHANGED,
    TRANSACTION_DELETED,
    MANUAL_OVERRIDE,
    TRANSACTION_VIEWED
}
