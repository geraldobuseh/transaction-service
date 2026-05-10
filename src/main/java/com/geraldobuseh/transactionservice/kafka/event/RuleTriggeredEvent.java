package com.geraldobuseh.transactionservice.kafka.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RuleTriggeredEvent(
        String eventId,
        String correlationId,
        Long transactionId,
        String username,
        String role,
        LocalDateTime timestamp,
        String status,
        String ruleTriggered,
        BigDecimal amount,
        String type,
        String description
) {
}
