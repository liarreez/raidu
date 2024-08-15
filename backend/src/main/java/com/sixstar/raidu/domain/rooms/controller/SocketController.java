package com.sixstar.raidu.domain.rooms.controller;

import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Date;

import org.slf4j.Logger;


@Controller
public class SocketController {

  private static final Logger LOGGER = LoggerFactory.getLogger(SocketController.class);
  private final SimpMessageSendingOperations simpleMessageSendingOperations;

  // CUSTOM
  private final Map<String, String> sessions = new ConcurrentHashMap<>();

  public SocketController(SimpMessageSendingOperations simpleMessageSendingOperations) {
    this.simpleMessageSendingOperations = simpleMessageSendingOperations;
  }


  @EventListener
  public void handleWebSocketConnectListener(SessionConnectEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    String sessionId = headerAccessor.getSessionId();
    String userId = headerAccessor.getNativeHeader("UserId").get(0);
    sessions.put(sessionId, userId);

  }

  @EventListener
  public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    String sessionId = headerAccessor.getSessionId();
    sessions.remove(sessionId);
  }

  @MessageMapping("/message")
  public void messageRouter(Map<String, Object> params) { // 사용자가 publish하는 모든 메시지를 받습니다. 메시지의 종류에 따라 아래 메서드로 분류합니다.
    String channel = (String) params.get("channel");
    String user = (String) params.get("user");
    simpleMessageSendingOperations.convertAndSend("/sub/message/" +channel, params);
  }

  // 콘솔에 요청 시각, 메서드 출력
  public void printLog(String request, String otherChunk) {
    System.out.printf("Requested %s: ", request.toUpperCase());
    Date date = new Date();
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    System.out.print(dateFormat.format(date));

    if(otherChunk.isEmpty()) System.out.println();
    else System.out.printf("---------- requestID : %s\n", otherChunk);
  }
}
