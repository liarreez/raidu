package com.sixstar.raidu.global.response;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BaseResponseServiceImpl implements BaseResponseService{
  public <T> ResponseEntity<BaseResponse<?>> getSuccessResponse(T data) {
    BaseResponse<?> baseResponse = new BaseResponse<>(data);
    return ResponseEntity.ok(baseResponse);
  }

  public <T> ResponseEntity<BaseResponse<?>> getSuccessResponse() {
    BaseResponse<?> baseResponse = new BaseResponse<>();
    return ResponseEntity.ok(baseResponse);
  }
}