package com.sixstar.raidu.global.config;

import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class EmailConfig {

  /* set important data */
  @Value("${spring.mail.username}") private String username;
  @Value("${spring.mail.password}") private String password;

  @Bean
  public JavaMailSender mailSender() {

    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setHost("smtp.gmail.com");
    mailSender.setPort(587);
    mailSender.setUsername(username);
    mailSender.setPassword(password);

    Properties javaMailProperties = new Properties();
    javaMailProperties.put("mail.transport.protocol", "smtp");
    javaMailProperties.put("mail.smtp.auth", "true");
    javaMailProperties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
    javaMailProperties.put("mail.smtp.starttls.enable", "true");
    javaMailProperties.put("mail.debug", "true");
    javaMailProperties.put("mail.smtp.ssl.trust", "smtp.gmail.com");
    javaMailProperties.put("mail.smtp.ssl.protocols", "TLSv1.3");

    mailSender.setJavaMailProperties(javaMailProperties);
    mailSender.setDefaultEncoding("UTF-8");

    return mailSender;
  }
}

