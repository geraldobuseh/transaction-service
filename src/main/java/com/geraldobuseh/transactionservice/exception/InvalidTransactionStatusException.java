package com.geraldobuseh.transactionservice.exception;

public class InvalidTransactionStatusException extends RuntimeException {

    public InvalidTransactionStatusException(String message) {
        super(message);
    }
}
