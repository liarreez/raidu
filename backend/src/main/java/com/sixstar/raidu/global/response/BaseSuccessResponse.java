package com.sixstar.raidu.global.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum BaseSuccessResponse {
  //2XX : Success
  OK(HttpStatus.OK, "success"),
  REGISTER_SUCCESS(HttpStatus.CREATED, "User registered successfully"),
  LOGIN_SUCCESS(HttpStatus.OK, "Login successful"),
  LOGOUT_SUCCESS(HttpStatus.OK, "Logout successful"),
  REFRESH_TOKEN_SUCCESS(HttpStatus.OK, "Token refreshed successfully"),
  ROOM_CREATE_SUCCESS(HttpStatus.CREATED, "Room created successfully"),
  ROOM_ENTER_SUCCESS(HttpStatus.CREATED, "Entered successfully"),
  GET_WAITING_ROOMS_SUCCESS(HttpStatus.OK, "Get WaitingRooms successfully"),
  NO_WAITING_ROOMS(HttpStatus.NO_CONTENT, "NO WaitingRooms"),
  EXIT_HOST(HttpStatus.OK, "Exit host And Room deleted"),
  EXIT_PARTICIPANT(HttpStatus.OK, "Exit Participant"),
  UPDATE_ROOM_SETTINGS_SUCCESS(HttpStatus.OK, "Room settings updated successfully"),
  UPDATE_ROOM_STATUS_SUCCESS(HttpStatus.OK, "Room status updated successfully"),
  INIT_SESSION_SUCCESS(HttpStatus.OK, "Session initialized successfully")
  ;

  private final HttpStatus status;
  private final String message;

  BaseSuccessResponse(HttpStatus status, String message) {
    this.status = status;
    this.message = message;
  }
}
