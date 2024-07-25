package com.sixstar.raidu.global.response;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BaseResponseServiceImpl implements BaseResponseService{
  public <T> ResponseEntity<BaseResponse<?>> getSuccessResponse(BaseSuccessResponse baseResponseStatus, T data) {
    BaseResponse<?> baseResponse = BaseResponse.builder()
        .status(baseResponseStatus.getStatus())
        .message(baseResponseStatus.getMessage())
        .data(data)
        .build();
    return new ResponseEntity<>(baseResponse, baseResponse.getStatus());
  }

  public <T> ResponseEntity<BaseResponse<?>> getSuccessResponse(BaseSuccessResponse baseResponseStatus) {
    BaseResponse<?> baseResponse = BaseResponse.builder()
        .status(baseResponseStatus.getStatus())
        .message(baseResponseStatus.getMessage())
        .data(null)
        .build();
    return new ResponseEntity<>(baseResponse, baseResponse.getStatus());
  }
}
