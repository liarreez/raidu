package com.sixstar.raidu;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
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
