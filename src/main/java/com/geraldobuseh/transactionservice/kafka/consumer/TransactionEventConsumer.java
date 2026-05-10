package com.geraldobuseh.transactionservice.kafka.consumer;

import com.geraldobuseh.transactionservice.kafka.KafkaTopics;
import com.geraldobuseh.transactionservice.kafka.event.RuleTriggeredEvent;
import com.geraldobuseh.transactionservice.kafka.event.TransactionCreatedEvent;
import com.geraldobuseh.transactionservice.kafka.event.TransactionFlaggedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class TransactionEventConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionEventConsumer.class);

    @KafkaListener(topics = KafkaTopics.TRANSACTION_CREATED, groupId = "transaction-service-created-consumer")
    public void onTransactionCreated(TransactionCreatedEvent event) {
        withEventContext(event.correlationId(), event.username(), () -> LOGGER.info(
                "operation=kafka_event_received eventType=TRANSACTION_CREATED transactionId={} user={} role={} status={} amount={}",
                event.transactionId(),
                event.username(),
                event.role(),
                event.status(),
                event.amount()
        ));
    }

    @KafkaListener(topics = KafkaTopics.TRANSACTION_FLAGGED, groupId = "transaction-service-flagged-consumer")
    public void onTransactionFlagged(TransactionFlaggedEvent event) {
        withEventContext(event.correlationId(), event.username(), () -> LOGGER.info(
                "operation=kafka_event_received eventType=TRANSACTION_FLAGGED transactionId={} user={} role={} ruleTriggered={} amount={}",
                event.transactionId(),
                event.username(),
                event.role(),
                event.ruleTriggered(),
                event.amount()
        ));
    }

    @KafkaListener(topics = KafkaTopics.RULE_TRIGGERED, groupId = "transaction-service-rule-consumer")
    public void onRuleTriggered(RuleTriggeredEvent event) {
        withEventContext(event.correlationId(), event.username(), () -> LOGGER.info(
                "operation=kafka_event_received eventType=RULE_TRIGGERED transactionId={} user={} role={} ruleTriggered={} status={}",
                event.transactionId(),
                event.username(),
                event.role(),
                event.ruleTriggered(),
                event.status()
        ));
    }

    private void withEventContext(String correlationId, String username, Runnable operation) {
        MDC.put("correlationId", correlationId);
        MDC.put("username", username);
        try {
            operation.run();
        } catch (RuntimeException exception) {
            LOGGER.error(
                    "operation=kafka_consumer_failed correlationId={} error={}",
                    correlationId,
                    exception.getMessage(),
                    exception
            );
            throw exception;
        } finally {
            MDC.clear();
        }
    }
}
