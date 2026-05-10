package com.geraldobuseh.transactionservice;

import com.geraldobuseh.transactionservice.entity.Transaction;
import com.geraldobuseh.transactionservice.entity.TransactionStatus;
import com.geraldobuseh.transactionservice.entity.TransactionType;
import org.junit.jupiter.api.Test;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class DroolsRulesTest {

    @Autowired
    private KieContainer kieContainer;

    @Test
    void flagsHighValueTransaction() {
        Transaction transaction = transactionWithAmountAndType("10000.01", TransactionType.DEBIT);

        fireRules(transaction);

        assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.FLAGGED);
    }

    @Test
    void approvesNormalTransaction() {
        Transaction transaction = transactionWithAmountAndType("10000.00", TransactionType.CREDIT);

        fireRules(transaction);

        assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.APPROVED);
    }

    @Test
    void flagsMediumDebitTransaction() {
        Transaction transaction = transactionWithAmountAndType("5000.01", TransactionType.DEBIT);

        fireRules(transaction);

        assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.FLAGGED);
    }

    @Test
    void approvesStandardDebitTransaction() {
        Transaction transaction = transactionWithAmountAndType("5000.00", TransactionType.DEBIT);

        fireRules(transaction);

        assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.APPROVED);
    }

    @Test
    void approvesStandardCreditTransaction() {
        Transaction transaction = transactionWithAmountAndType("15000.00", TransactionType.CREDIT);

        fireRules(transaction);

        assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.APPROVED);
    }

    @Test
    void flagsVeryHighCreditTransaction() {
        Transaction transaction = transactionWithAmountAndType("20000.01", TransactionType.CREDIT);

        fireRules(transaction);

        assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.FLAGGED);
    }

    private void fireRules(Transaction transaction) {
        KieSession kieSession = kieContainer.newKieSession();
        try {
            kieSession.insert(transaction);
            kieSession.fireAllRules();
        } finally {
            kieSession.dispose();
        }
    }

    private Transaction transactionWithAmountAndType(String amount, TransactionType type) {
        Transaction transaction = new Transaction();
        transaction.setAmount(new BigDecimal(amount));
        transaction.setType(type);
        return transaction;
    }
}
