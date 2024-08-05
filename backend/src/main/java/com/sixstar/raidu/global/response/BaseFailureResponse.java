package com.sixstar.raidu.global.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum BaseFailureResponse {
  //4XX : Client Error

  //5XX : Server Error
  INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "예상치 못한 서버에러입니다!"),
  // 특정 상황
  EMAIL_IS_DUPLICATED(HttpStatus.CONFLICT, "중복된 이메일입니다!"),
  USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다!"),
  USERPROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 유저 프로필입니다!"),
  LOGIN_FAIL(HttpStatus.UNAUTHORIZED, "이메일 혹은 비밀번호가 틀렸습니다!"),
  ACCESS_TOKEN_IS_EXPIRED(HttpStatus.UNAUTHORIZED, "액세스 토큰이 만료되었습니다!"),
  INVALID_ACCESS_TOKEN_SIGNATURE(HttpStatus.UNAUTHORIZED, "액세스 토큰의 서명이 유효하지 않습니다."),
  INVALID_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 액세스 토큰입니다."),
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
  SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 세션입니다!"),
  SEASON_NOT_FOUND(HttpStatus.NOT_FOUND, "현재 날짜와 일치하는 시즌이 없습니다!"),
  BOSSMONSTER_NOT_FOUND(HttpStatus.NOT_FOUND, "현재 시즌과 일치하는 보스몬스터가 없습니다!"),
  ROUNDRECORD_NOT_FOUND(HttpStatus.BAD_REQUEST, "저장할 라운드 기록이 없습니다!"),
  DICTIONARY_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 운동입니다!"),
  NOT_JSON_TYPE(HttpStatus.BAD_REQUEST, "JSON 형태의 타입이 아닙니다!"),
  WITHDRAW_USER(HttpStatus.BAD_REQUEST, "회원 탈퇴한 유저입니다!"),
  REPORTED_USER(HttpStatus.BAD_REQUEST, "신고 당한 유저입니다!")
  ;

  private final HttpStatus status;
  private final String message;

  BaseFailureResponse(HttpStatus status, String message) {
    this.status = status;
    this.message = message;
  }
}
