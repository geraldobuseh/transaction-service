package com.geraldobuseh.transactionservice.audit;

import com.geraldobuseh.transactionservice.audit.dto.AuditEventResponse;
import com.geraldobuseh.transactionservice.dto.PageResponse;
import com.geraldobuseh.transactionservice.entity.Transaction;
import com.geraldobuseh.transactionservice.entity.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransactionAuditService {

    private static final AuditActor SYSTEM_ACTOR = new AuditActor("system", "SYSTEM");

    private final TransactionAuditRepository transactionAuditRepository;

    public TransactionAuditService(TransactionAuditRepository transactionAuditRepository) {
        this.transactionAuditRepository = transactionAuditRepository;
    }

    @Transactional
    public void logTransactionCreated(Transaction transaction) {
        saveEvent(
                transaction,
                AuditEventType.TRANSACTION_CREATED,
                null,
                transaction.getStatus(),
                "Transaction created and queued for rule evaluation.",
                null
        );
    }

    @Transactional
    public void logRuleEvaluation(Transaction transaction, List<String> firedRules) {
        String ruleSummary = formatRuleSummary(firedRules);
        saveEvent(
                transaction,
                AuditEventType.RULE_EVALUATED,
                null,
                null,
                "Drools rule engine evaluated the transaction.",
                ruleSummary
        );
    }

    @Transactional
    public void logStatusChange(
            Transaction transaction,
            TransactionStatus previousStatus,
            TransactionStatus newStatus,
            String reason
    ) {
        saveEvent(
                transaction,
                AuditEventType.STATUS_CHANGED,
                previousStatus,
                newStatus,
                reason,
                null
        );
    }

    @Transactional
    public void logTransactionDeleted(Transaction transaction) {
        saveEvent(
                transaction,
                AuditEventType.TRANSACTION_DELETED,
                transaction.getStatus(),
                transaction.getStatus(),
                "Transaction was marked as deleted by an authorized user.",
                null
        );
    }

    @Transactional
    public void logTransactionViewed(Transaction transaction) {
        saveEvent(
                transaction,
                AuditEventType.TRANSACTION_VIEWED,
                transaction.getStatus(),
                transaction.getStatus(),
                "Transaction detail record was viewed.",
                null
        );
    }

    @Transactional
    public void logManualOverride(
            Transaction transaction,
            TransactionStatus previousStatus,
            TransactionStatus newStatus,
            String reason
    ) {
        saveEvent(
                transaction,
                AuditEventType.MANUAL_OVERRIDE,
                previousStatus,
                newStatus,
                reason,
                null
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<AuditEventResponse> getTransactionHistory(Long transactionId, Pageable pageable) {
        Page<AuditEventResponse> events = transactionAuditRepository
                .findByTransactionId(transactionId, pageable)
                .map(this::mapToResponse);

        return new PageResponse<>(events);
    }

    private void saveEvent(
            Transaction transaction,
            AuditEventType eventType,
            TransactionStatus previousStatus,
            TransactionStatus newStatus,
            String eventDescription,
            String ruleTriggered
    ) {
        AuditActor actor = currentActor();

        TransactionAuditEvent event = new TransactionAuditEvent();
        event.setTransactionId(transaction.getId());
        event.setEventType(eventType);
        event.setPreviousStatus(previousStatus);
        event.setNewStatus(newStatus);
        event.setPerformedBy(actor.username());
        event.setPerformedByRole(actor.role());
        event.setEventDescription(eventDescription);
        event.setRuleTriggered(ruleTriggered);

        transactionAuditRepository.save(event);
    }

    private AuditActor currentActor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return SYSTEM_ACTOR;
        }

        String role = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring("ROLE_".length()))
                .findFirst()
                .orElse("AUTHENTICATED");

        return new AuditActor(authentication.getName(), role);
    }

    private String formatRuleSummary(List<String> firedRules) {
        if (firedRules == null || firedRules.isEmpty()) {
            return "No matching rule fired";
        }

        return String.join(", ", firedRules);
    }

    private AuditEventResponse mapToResponse(TransactionAuditEvent event) {
        AuditEventResponse response = new AuditEventResponse();
        response.setId(event.getId());
        response.setTransactionId(event.getTransactionId());
        response.setEventType(event.getEventType());
        response.setPreviousStatus(event.getPreviousStatus());
        response.setNewStatus(event.getNewStatus());
        response.setPerformedBy(event.getPerformedBy());
        response.setPerformedByRole(event.getPerformedByRole());
        response.setEventDescription(event.getEventDescription());
        response.setRuleTriggered(event.getRuleTriggered());
        response.setCreatedAt(event.getCreatedAt());
        return response;
    }

    private record AuditActor(String username, String role) {
    }
}
