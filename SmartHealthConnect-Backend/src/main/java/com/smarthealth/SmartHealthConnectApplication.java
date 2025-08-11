package com.smarthealth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SmartHealthConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartHealthConnectApplication.class, args);
    }
}
