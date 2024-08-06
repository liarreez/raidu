package com.sixstar.raidu.global.config;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketConfig.class);

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/api/ws")
        .setAllowedOrigins("http://localhost:3000", "http://localhost:5173", "https://i11a108.p.ssafy.io:4443"
            ,"https://i11a108.p.ssafy.io:3000","https://i11a108.p.ssafy.io","https://i11a108.p.ssafy.io:8080","https://i11a108.p.ssafy.io:8082")
        .withSockJS() // not allows wildcard(*) on AllowedOriginPatterns, apic 테스트 시 주석 처리
    ;
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker("/sub");
    registry.setApplicationDestinationPrefixes("/pub");
  }
}
