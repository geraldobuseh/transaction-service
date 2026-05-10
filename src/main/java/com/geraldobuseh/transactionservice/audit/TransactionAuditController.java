package com.geraldobuseh.transactionservice.audit;

import com.geraldobuseh.transactionservice.audit.dto.AuditEventResponse;
import com.geraldobuseh.transactionservice.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit")
public class TransactionAuditController {

    private final TransactionAuditService transactionAuditService;

    public TransactionAuditController(TransactionAuditService transactionAuditService) {
        this.transactionAuditService = transactionAuditService;
    }

    @GetMapping("/transaction/{transactionId}")
    public PageResponse<AuditEventResponse> getTransactionHistory(
            @PathVariable Long transactionId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return transactionAuditService.getTransactionHistory(transactionId, pageable);
    }
}
