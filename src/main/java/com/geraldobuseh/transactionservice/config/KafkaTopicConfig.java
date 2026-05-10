package com.geraldobuseh.transactionservice.config;

import com.geraldobuseh.transactionservice.kafka.KafkaTopics;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic transactionCreatedTopic() {
        return TopicBuilder.name(KafkaTopics.TRANSACTION_CREATED)
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic transactionFlaggedTopic() {
        return TopicBuilder.name(KafkaTopics.TRANSACTION_FLAGGED)
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic ruleTriggeredTopic() {
        return TopicBuilder.name(KafkaTopics.RULE_TRIGGERED)
                .partitions(1)
                .replicas(1)
                .build();
    }
}
