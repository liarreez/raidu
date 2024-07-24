package com.sixstar.raidu.global.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class BaseException extends RuntimeException {
  private final BaseResponseStatus baseResponseStatus;
}
