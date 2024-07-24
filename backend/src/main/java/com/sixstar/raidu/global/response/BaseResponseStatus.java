package com.sixstar.raidu.global.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum BaseResponseStatus {
  //2XX : Success
  OK(HttpStatus.OK, "success"),

  //4XX : Client Error

  //5XX : Server Error

  // 특정 상황

  ;

  private final HttpStatus status;
  private final String message;

  BaseResponseStatus(HttpStatus status, String message) {
    this.status = status;
    this.message = message;
  }
}
