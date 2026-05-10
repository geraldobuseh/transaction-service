package com.geraldobuseh.transactionservice.repository;

import com.geraldobuseh.transactionservice.dto.TransactionFilterCriteria;
import com.geraldobuseh.transactionservice.entity.Transaction;
import com.geraldobuseh.transactionservice.entity.TransactionStatus;
import com.geraldobuseh.transactionservice.entity.TransactionType;
import com.geraldobuseh.transactionservice.exception.InvalidTransactionStatusException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class TransactionSpecifications {

    private TransactionSpecifications() {
    }

    public static Specification<Transaction> matching(TransactionFilterCriteria criteria) {
        return Specification
                .where(hasStatus(criteria.getStatus()))
                .and(hasType(criteria.getType()))
                .and(hasUserId(criteria.getUserId()))
                .and(hasMinimumAmount(criteria.getMinAmount()))
                .and(hasMaximumAmount(criteria.getMaxAmount()));
    }

    private static Specification<Transaction> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(status)) {
                return criteriaBuilder.conjunction();
            }

            try {
                return criteriaBuilder.equal(root.get("status"), TransactionStatus.valueOf(status.trim().toUpperCase()));
            } catch (IllegalArgumentException exception) {
                throw new InvalidTransactionStatusException("Invalid transaction status: " + status);
            }
        };
    }

    private static Specification<Transaction> hasType(String type) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(type)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(root.get("type"), TransactionType.fromString(type));
        };
    }

    private static Specification<Transaction> hasUserId(String userId) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(userId)) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("userId")),
                    "%" + userId.trim().toLowerCase() + "%"
            );
        };
    }

    private static Specification<Transaction> hasMinimumAmount(java.math.BigDecimal minAmount) {
        return (root, query, criteriaBuilder) -> minAmount == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.greaterThanOrEqualTo(root.get("amount"), minAmount);
    }

    private static Specification<Transaction> hasMaximumAmount(java.math.BigDecimal maxAmount) {
        return (root, query, criteriaBuilder) -> maxAmount == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.lessThanOrEqualTo(root.get("amount"), maxAmount);
    }
}
