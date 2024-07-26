package com.sixstar.raidu.global.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum BaseSuccessResponse {
  //2XX : Success
  OK(HttpStatus.OK, "success"),
  REGISTER_SUCCESS(HttpStatus.CREATED, "User registered successfully"),
  ROOM_CREATE_SUCCESS(HttpStatus.CREATED, "Room created successfully"),
  ROOM_ENTER_SUCCESS(HttpStatus.OK, "Entered successfully"),
  GET_WAITING_ROOMS_SUCCESS(HttpStatus.OK, "Get WaitingRooms successfully"),
  NO_WAITING_ROOMS(HttpStatus.NO_CONTENT, "NO WaitingRooms");
  ;

  private final HttpStatus status;
  private final String message;

  BaseSuccessResponse(HttpStatus status, String message) {
    this.status = status;
    this.message = message;
  }
}
