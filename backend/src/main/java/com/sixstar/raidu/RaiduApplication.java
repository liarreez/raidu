package com.sixstar.raidu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class RaiduApplication {

	public static void main(String[] args) {
		SpringApplication.run(RaiduApplication.class, args);
	}

}
