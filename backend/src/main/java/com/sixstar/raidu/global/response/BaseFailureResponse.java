package com.sixstar.raidu.global.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum BaseFailureResponse {
  //4XX : Client Error

  //5XX : Server Error

  // 특정 상황
  DuplicateEmailException(HttpStatus.CONFLICT, "중복된 이메일입니다!"),
  USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다!"),
  ENTER_ROOM_FAIL(HttpStatus.BAD_REQUEST, "대기방 입장에 실패했습니다!"),
  ;

  private final HttpStatus status;
  private final String message;

  BaseFailureResponse(HttpStatus status, String message) {
    this.status = status;
    this.message = message;
  }
}
