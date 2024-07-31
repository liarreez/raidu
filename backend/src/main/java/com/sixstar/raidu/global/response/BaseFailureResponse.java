package com.sixstar.raidu.global.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum BaseFailureResponse {
  //4XX : Client Error

  //5XX : Server Error

  // 특정 상황
  EMAIL_IS_DUPLICATED(HttpStatus.CONFLICT, "중복된 이메일입니다!"),
  USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다!"),
  LOGIN_FAIL(HttpStatus.UNAUTHORIZED, "이메일 혹은 비밀번호가 틀렸습니다!"),
  ACCESS_TOKEN_IS_EXPIRED(HttpStatus.UNAUTHORIZED, "액세스 토큰이 만료되었습니다!"),
  REFRESH_TOKEN_IS_EXPIRED(HttpStatus.UNAUTHORIZED, "리프레시 토큰이 만료되었습니다!"),
  INVALID_REFRESH_TOKEN(HttpStatus.BAD_REQUEST, "유효하지 않은 리프레시 토큰입니다!"),
  INVALID_AUTHORIZED_HEADER(HttpStatus.BAD_REQUEST, "유효하지 않은 인증 해더 입니다!"),
  SETTING_IS_NEEDED(HttpStatus.TEMPORARY_REDIRECT, "닉네임 및 지역 설정이 필요합니다!"),
  SETTING_IS_REGISTERED(HttpStatus.CONFLICT, "이미 닉네임 및 지역 설정을 하셨습니다!"),
  REGION_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 지역입니다!"),
  NICKNAME_IS_DUPLICATED(HttpStatus.CONFLICT, "이미 존재하는 닉네임입니다!"),
  ENTER_ROOM_FAIL(HttpStatus.BAD_REQUEST, "대기방 입장에 실패했습니다!"),
  FULL_ROOM(HttpStatus.CONFLICT, "대기방의 인원이 꽉 찼습니다!"),
  ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 방입니다!"),
  ROOM_USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 참여자입니다!"),
  SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 세션입니다!")

  ;

  private final HttpStatus status;
  private final String message;

  BaseFailureResponse(HttpStatus status, String message) {
    this.status = status;
    this.message = message;
  }
}
