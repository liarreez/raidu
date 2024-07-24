package com.sixstar.raidu.global.response;

public interface BaseResponseService {
  <T> BaseResponse<Object> getSuccessResponse(T data);

  <T> BaseResponse<Object> getSuccessResponse();

  <T> BaseResponse<Object> getFailureResponse(BaseResponseStatus status);
}
