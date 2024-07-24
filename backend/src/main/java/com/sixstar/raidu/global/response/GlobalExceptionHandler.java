package com.sixstar.raidu.global.response;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

  private BaseResponseService baseResponseService;

  @ExceptionHandler(BaseException.class)
  protected ResponseEntity<BaseResponse<?>> handleBaseException(BaseException ex) {
    BaseResponse<?> response = baseResponseService.getFailureResponse(ex.getBaseResponseStatus());
    return new ResponseEntity<>(response, ex.getBaseResponseStatus().getStatus());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<BaseResponse<?>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    StringBuilder errorMessage = new StringBuilder();
    ex.getBindingResult().getAllErrors().forEach(error -> {
      errorMessage.append(error.getDefaultMessage());
    });

    BaseResponse<?> response = BaseResponse.builder()
        .status(HttpStatus.BAD_REQUEST)
        .message(errorMessage.toString())
        .build();

    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
  }
}
