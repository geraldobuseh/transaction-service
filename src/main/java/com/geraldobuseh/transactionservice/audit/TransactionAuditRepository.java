package com.geraldobuseh.transactionservice.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TransactionAuditRepository extends JpaRepository<TransactionAuditEvent, Long> {

    List<TransactionAuditEvent> findByTransactionIdOrderByCreatedAtDesc(Long transactionId);

    List<TransactionAuditEvent> findByTransactionIdOrderByCreatedAtAsc(Long transactionId);

    Page<TransactionAuditEvent> findByTransactionId(Long transactionId, Pageable pageable);

    List<TransactionAuditEvent> findByPerformedByOrderByCreatedAtDesc(String performedBy);
}
