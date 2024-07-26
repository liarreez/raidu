package com.sixstar.raidu.global.response;

import org.springframework.http.ResponseEntity;

public interface BaseResponseService {
  <T> ResponseEntity<BaseResponse<?>> getSuccessResponse(BaseSuccessResponse baseResponseStatus, T data);

  <T> ResponseEntity<BaseResponse<?>> getSuccessResponse(BaseSuccessResponse baseResponseStatus);
}
