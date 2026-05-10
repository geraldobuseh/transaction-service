package com.geraldobuseh.transactionservice.service;

import com.geraldobuseh.transactionservice.dto.CreateTransactionRequest;
import com.geraldobuseh.transactionservice.dto.TransactionFilterCriteria;
import com.geraldobuseh.transactionservice.dto.TransactionResponse;
import com.geraldobuseh.transactionservice.audit.TransactionAuditService;
import com.geraldobuseh.transactionservice.entity.Transaction;
import com.geraldobuseh.transactionservice.entity.TransactionStatus;
import com.geraldobuseh.transactionservice.entity.TransactionType;
import com.geraldobuseh.transactionservice.kafka.producer.TransactionEventPublisher;
import com.geraldobuseh.transactionservice.repository.TransactionRepository;
import com.geraldobuseh.transactionservice.repository.TransactionSpecifications;
import org.kie.api.event.rule.AfterMatchFiredEvent;
import org.kie.api.event.rule.DefaultAgendaEventListener;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepository transactionRepository;
    private final KieContainer kieContainer;
    private final TransactionAuditService transactionAuditService;
    private final TransactionEventPublisher transactionEventPublisher;

    public TransactionService(
            TransactionRepository transactionRepository,
            KieContainer kieContainer,
            TransactionAuditService transactionAuditService,
            TransactionEventPublisher transactionEventPublisher
    ) {
        this.transactionRepository = transactionRepository;
        this.kieContainer = kieContainer;
        this.transactionAuditService = transactionAuditService;
        this.transactionEventPublisher = transactionEventPublisher;
    }

    @Transactional
    public TransactionResponse createTransaction(CreateTransactionRequest request) {

        Transaction transaction = new Transaction();
        transaction.setUserId(request.getUserId());
        transaction.setAmount(request.getAmount());
        transaction.setType(TransactionType.fromString(request.getType()));
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setDescription(request.getDescription());
        transaction.setCreatedAt(LocalDateTime.now());

        Transaction saved = transactionRepository.save(transaction);
        transactionAuditService.logTransactionCreated(saved);
        transactionEventPublisher.publishTransactionCreated(saved);
        LOGGER.info(
                "operation=transaction_created transactionId={} status={} amount={} type={}",
                saved.getId(),
                saved.getStatus(),
                saved.getAmount(),
                saved.getType()
        );

        TransactionStatus previousStatus = saved.getStatus();
        List<String> firedRules = applyRules(saved);
        transactionAuditService.logRuleEvaluation(saved, firedRules);
        for (String ruleName : firedRules) {
            transactionEventPublisher.publishRuleTriggered(saved, ruleName);
        }

        if (previousStatus != saved.getStatus()) {
            transactionAuditService.logStatusChange(
                    saved,
                    previousStatus,
                    saved.getStatus(),
                    "Transaction status changed after Drools rule evaluation."
            );
            if (saved.getStatus() == TransactionStatus.FLAGGED) {
                transactionEventPublisher.publishTransactionFlagged(saved, formatRuleSummary(firedRules));
            }
            LOGGER.info(
                    "operation=transaction_status_changed transactionId={} previousStatus={} newStatus={}",
                    saved.getId(),
                    previousStatus,
                    saved.getStatus()
            );
        }

        saved = transactionRepository.save(saved);

        return mapToResponse(saved);
    }

    private String formatRuleSummary(List<String> firedRules) {
        if (firedRules == null || firedRules.isEmpty()) {
            return "No matching rule fired";
        }

        return String.join(", ", firedRules);
    }

    private List<String> applyRules(Transaction transaction) {
        KieSession kieSession = kieContainer.newKieSession();
        List<String> firedRuleNames = new ArrayList<>();
        try {
            kieSession.addEventListener(new DefaultAgendaEventListener() {
                @Override
                public void afterMatchFired(AfterMatchFiredEvent event) {
                    firedRuleNames.add(event.getMatch().getRule().getName());
                }
            });

            LOGGER.info(
                    "operation=rule_evaluation_started transactionId={} type={} amount={}",
                    transaction.getId(),
                    transaction.getType(),
                    transaction.getAmount()
            );
            kieSession.insert(transaction);
            int firedRules = kieSession.fireAllRules();
            LOGGER.info(
                    "operation=rule_evaluation_completed transactionId={} firedRules={} ruleNames={} status={}",
                    transaction.getId(),
                    firedRules,
                    String.join(",", firedRuleNames),
                    transaction.getStatus()
            );
            return firedRuleNames;
        } finally {
            kieSession.dispose();
        }
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactions(TransactionFilterCriteria criteria) {
        return transactionRepository.findAll(TransactionSpecifications.matching(criteria))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transactionAuditService.logTransactionViewed(transaction);

        return mapToResponse(transaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByUserId(String userId) {
        return transactionRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();

        response.setId(transaction.getId());
        response.setUserId(transaction.getUserId());
        response.setAmount(transaction.getAmount());
        response.setType(transaction.getType());
        response.setStatus(transaction.getStatus());
        response.setDescription(transaction.getDescription());
        response.setCreatedAt(transaction.getCreatedAt());

        return response;
    }
}
