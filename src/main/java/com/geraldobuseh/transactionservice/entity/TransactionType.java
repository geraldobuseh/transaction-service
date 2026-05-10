package com.geraldobuseh.transactionservice.entity;

import com.geraldobuseh.transactionservice.exception.InvalidTransactionTypeException;

import java.util.Locale;

public enum TransactionType {
    DEBIT,
    CREDIT;

    public static TransactionType fromString(String value) {
        if (value == null) {
            throw new InvalidTransactionTypeException("Transaction type is required");
        }

        try {
            return TransactionType.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new InvalidTransactionTypeException("Invalid transaction type: " + value);
        }
    }
}
