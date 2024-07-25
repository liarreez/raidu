package com.sixstar.raidu.global.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class BaseResponse<T> {
  private HttpStatus status;
  private String message;
  private T data;

  @Builder
  public BaseResponse(HttpStatus status, String message, T data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
