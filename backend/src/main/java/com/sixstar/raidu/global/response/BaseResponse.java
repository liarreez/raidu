package com.sixstar.raidu.global.response;

import lombok.Builder;
import org.springframework.http.HttpStatus;

public class BaseResponse<T> {
  private HttpStatus status;
  private String message;
  private T data;

  public BaseResponse(T data) {
    this.status = BaseResponseStatus.OK.getStatus();
    this.message = BaseResponseStatus.OK.getMessage();
    this.data = data;
  }

  public BaseResponse() {
    this.status = BaseResponseStatus.OK.getStatus();
    this.message = BaseResponseStatus.OK.getMessage();
    this.data = null;
  }

  public BaseResponse(BaseResponseStatus baseResponseStatus) {
    this.status = baseResponseStatus.getStatus();
    this.message = baseResponseStatus.getMessage();
    this.data = null;
  }

  @Builder
  public BaseResponse(HttpStatus status, String message, T data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
