package com.sixstar.raidu.global.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum BaseFailureResponse {
  //4XX : Client Error

  //5XX : Server Error

  // 특정 상황
<<<<<<< HEAD
  DuplicateEmailException(HttpStatus.CONFLICT, "중복된 이메일입니다!")
=======
  DuplicateEmailException(HttpStatus.CONFLICT, "중복된 이메일입니다!"),
  USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다!")
>>>>>>> 50e08d3808899c23ef692ec5531c91b143a11d7e
  ;

  private final HttpStatus status;
  private final String message;

  BaseFailureResponse(HttpStatus status, String message) {
    this.status = status;
    this.message = message;
  }
}