package com.geraldobuseh.transactionservice.kafka.producer;

import com.geraldobuseh.transactionservice.config.CorrelationIdFilter;
import com.geraldobuseh.transactionservice.entity.Transaction;
import com.geraldobuseh.transactionservice.kafka.KafkaTopics;
import com.geraldobuseh.transactionservice.kafka.event.RuleTriggeredEvent;
import com.geraldobuseh.transactionservice.kafka.event.TransactionCreatedEvent;
import com.geraldobuseh.transactionservice.kafka.event.TransactionFlaggedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TransactionEventPublisher {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionEventPublisher.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public TransactionEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishTransactionCreated(Transaction transaction) {
        EventActor actor = currentActor();
        TransactionCreatedEvent event = new TransactionCreatedEvent(
                newEventId(),
                currentCorrelationId(),
                transaction.getId(),
                actor.username(),
                actor.role(),
                LocalDateTime.now(),
                transaction.getStatus().name(),
                transaction.getAmount(),
                transaction.getType().name(),
                transaction.getDescription()
        );

        publish(KafkaTopics.TRANSACTION_CREATED, transaction.getId(), event);
    }

    public void publishRuleTriggered(Transaction transaction, String ruleTriggered) {
        EventActor actor = currentActor();
        RuleTriggeredEvent event = new RuleTriggeredEvent(
                newEventId(),
                currentCorrelationId(),
                transaction.getId(),
                actor.username(),
                actor.role(),
                LocalDateTime.now(),
                transaction.getStatus().name(),
                ruleTriggered,
                transaction.getAmount(),
                transaction.getType().name(),
                transaction.getDescription()
        );

        publish(KafkaTopics.RULE_TRIGGERED, transaction.getId(), event);
    }

    public void publishTransactionFlagged(Transaction transaction, String ruleTriggered) {
        EventActor actor = currentActor();
        TransactionFlaggedEvent event = new TransactionFlaggedEvent(
                newEventId(),
                currentCorrelationId(),
                transaction.getId(),
                actor.username(),
                actor.role(),
                LocalDateTime.now(),
                transaction.getStatus().name(),
                ruleTriggered,
                transaction.getAmount(),
                transaction.getType().name(),
                transaction.getDescription()
        );

        publish(KafkaTopics.TRANSACTION_FLAGGED, transaction.getId(), event);
    }

    private void publish(String topic, Long transactionId, Object event) {
        try {
            kafkaTemplate.send(topic, String.valueOf(transactionId), event)
                    .whenComplete((result, exception) -> {
                        if (exception != null) {
                            LOGGER.error(
                                    "operation=kafka_publish_failed topic={} transactionId={} eventType={} error={}",
                                    topic,
                                    transactionId,
                                    event.getClass().getSimpleName(),
                                    exception.getMessage(),
                                    exception
                            );
                            return;
                        }

                        LOGGER.info(
                                "operation=kafka_event_published topic={} partition={} offset={} transactionId={} eventType={}",
                                topic,
                                result.getRecordMetadata().partition(),
                                result.getRecordMetadata().offset(),
                                transactionId,
                                event.getClass().getSimpleName()
                        );
                    });
        } catch (RuntimeException exception) {
            LOGGER.error(
                    "operation=kafka_publish_rejected topic={} transactionId={} eventType={} error={}",
                    topic,
                    transactionId,
                    event.getClass().getSimpleName(),
                    exception.getMessage(),
                    exception
            );
        }
    }

    private String currentCorrelationId() {
        String correlationId = MDC.get(CorrelationIdFilter.CORRELATION_ID_MDC_KEY);
        return correlationId == null ? "none" : correlationId;
    }

    private String newEventId() {
        return UUID.randomUUID().toString();
    }

    private EventActor currentActor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return new EventActor("system", "SYSTEM");
        }

        String role = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring("ROLE_".length()))
                .findFirst()
                .orElse("AUTHENTICATED");

        return new EventActor(authentication.getName(), role);
    }

    private record EventActor(String username, String role) {
    }
}
