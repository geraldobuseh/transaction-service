package com.geraldobuseh.transactionservice.kafka.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionCreatedEvent(
        String eventId,
        String correlationId,
        Long transactionId,
        String username,
        String role,
        LocalDateTime timestamp,
        String status,
        BigDecimal amount,
        String type,
        String description
) {
}
