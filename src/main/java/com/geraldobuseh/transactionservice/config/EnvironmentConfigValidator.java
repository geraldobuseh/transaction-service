package com.geraldobuseh.transactionservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Component
public class EnvironmentConfigValidator implements ApplicationRunner {

    private final boolean validationEnabled;
    private final String jwtSecret;
    private final String datasourcePassword;
    private final String datasourceUsername;
    private final String kafkaBootstrapServers;

    public EnvironmentConfigValidator(
            @Value("${app.config.validation.enabled:false}") boolean validationEnabled,
            @Value("${jwt.secret:}") String jwtSecret,
            @Value("${spring.datasource.password:}") String datasourcePassword,
            @Value("${spring.datasource.username:}") String datasourceUsername,
            @Value("${spring.kafka.bootstrap-servers:}") String kafkaBootstrapServers
    ) {
        this.validationEnabled = validationEnabled;
        this.jwtSecret = jwtSecret;
        this.datasourcePassword = datasourcePassword;
        this.datasourceUsername = datasourceUsername;
        this.kafkaBootstrapServers = kafkaBootstrapServers;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!validationEnabled) {
            return;
        }

        List<String> missingValues = new ArrayList<>();
        requireText("JWT_SECRET", jwtSecret, missingValues);
        requireText("DB_USERNAME or SPRING_DATASOURCE_USERNAME", datasourceUsername, missingValues);
        requireText("DB_PASSWORD or SPRING_DATASOURCE_PASSWORD", datasourcePassword, missingValues);
        requireText("KAFKA_BOOTSTRAP_SERVERS or SPRING_KAFKA_BOOTSTRAP_SERVERS", kafkaBootstrapServers, missingValues);

        if (StringUtils.hasText(jwtSecret) && jwtSecret.length() < 32) {
            missingValues.add("JWT_SECRET must be at least 32 characters");
        }

        if (!missingValues.isEmpty()) {
            throw new IllegalStateException(
                    "Missing or invalid environment configuration: " + String.join(", ", missingValues)
            );
        }
    }

    private void requireText(String name, String value, List<String> missingValues) {
        if (!StringUtils.hasText(value)) {
            missingValues.add(name);
        }
    }
}
