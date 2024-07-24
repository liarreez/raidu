package com.sixstar.raidu.global.response;

public class BaseResponseServiceImpl {
  public <T> BaseResponse<Object> getSuccessResponse(T data) {
    return new BaseResponse<>(data);
  }

  public <T> BaseResponse<Object> getSuccessResponse() {
    return new BaseResponse<>();
  }

  public <T> BaseResponse<Object> getFailureResponse(BaseResponseStatus status) {
    return new BaseResponse<>(status);
  }
}
