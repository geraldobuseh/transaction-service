package com.geraldobuseh.transactionservice.config;

import org.kie.api.KieServices;
import org.kie.api.builder.*;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class DroolsConfig {

    private static final String RULES_PATH = "rules/transaction-rules.drl";
    private static final String KIE_RULES_PATH = "src/main/resources/" + RULES_PATH;

    @Bean
    public KieContainer kieContainer() {
        KieServices kieServices = KieServices.Factory.get();

        KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
        kieFileSystem.write(
                KIE_RULES_PATH,
                kieServices.getResources()
                        .newClassPathResource(RULES_PATH)
        );

        KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
        kieBuilder.buildAll();

        Results results = kieBuilder.getResults();
        if (results.hasMessages(Message.Level.ERROR)) {
            throw new IllegalStateException("Drools rule errors: " + results.getMessages());
        }

        KieRepository kieRepository = kieServices.getRepository();
        ReleaseId releaseId = kieRepository.getDefaultReleaseId();

        return kieServices.newKieContainer(releaseId);
    }

    @Bean
    @Scope("prototype")
    public KieSession kieSession(KieContainer kieContainer) {
        return kieContainer.newKieSession();
    }
}
