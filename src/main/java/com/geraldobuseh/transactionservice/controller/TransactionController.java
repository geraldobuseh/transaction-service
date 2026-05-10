package com.geraldobuseh.transactionservice.controller;

import com.geraldobuseh.transactionservice.dto.CreateTransactionRequest;
import com.geraldobuseh.transactionservice.dto.TransactionFilterCriteria;
import com.geraldobuseh.transactionservice.dto.TransactionResponse;
import com.geraldobuseh.transactionservice.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public TransactionResponse createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        return transactionService.createTransaction(request);
    }

    @GetMapping
    public List<TransactionResponse> getTransactions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount
    ) {
        TransactionFilterCriteria criteria = new TransactionFilterCriteria(
                status,
                type,
                userId,
                minAmount,
                maxAmount
        );
        return transactionService.getTransactions(criteria);
    }

    @GetMapping("/{id}")
    public TransactionResponse getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id);
    }

    @GetMapping("/user/{userId}")
    public List<TransactionResponse> getTransactionsByUserId(@PathVariable String userId) {
        return transactionService.getTransactionsByUserId(userId);
    }
}
