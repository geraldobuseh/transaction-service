package com.geraldobuseh.transactionservice.kafka;

public final class KafkaTopics {

    public static final String TRANSACTION_CREATED = "transaction-created";
    public static final String TRANSACTION_FLAGGED = "transaction-flagged";
    public static final String RULE_TRIGGERED = "rule-triggered";

    private KafkaTopics() {
    }
}
