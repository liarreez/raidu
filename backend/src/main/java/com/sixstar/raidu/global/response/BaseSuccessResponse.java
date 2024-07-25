package com.sixstar.raidu.global.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum BaseSuccessResponse {
  //2XX : Success
  OK(HttpStatus.OK, "success"),
<<<<<<< HEAD
  REGISTER_SUCCESS(HttpStatus.CREATED, "User registered successfully")
=======
  REGISTER_SUCCESS(HttpStatus.CREATED, "User registered successfully"),
  ROOM_CREATE_SUCCESS(HttpStatus.CREATED, "Room created successfully")
>>>>>>> 50e08d3808899c23ef692ec5531c91b143a11d7e
  ;

  private final HttpStatus status;
  private final String message;

  BaseSuccessResponse(HttpStatus status, String message) {
    this.status = status;
    this.message = message;
  }
}
