package com.sixstar.raidu.domain.main.controller;

import com.sixstar.raidu.domain.main.service.MainpageService;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/raidu/mainpage")
@RequiredArgsConstructor
public class MainpageController {
  private final MainpageService mainpageService;
  private final BaseResponseService baseResponseService;

  @GetMapping("")
  public ResponseEntity<BaseResponse<?>> retrieve(@RequestHeader("Authorization") String authorization) {
    Map<String, Object> data = mainpageService.retrieve(authorization);
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.MAINPAGE_DATA_RETRIEVE_SUCCESS, data);
  }
}
