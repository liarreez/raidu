package com.sixstar.raidu.domain.userpage.controller;

import com.sixstar.raidu.domain.userpage.dto.UserprofileRegisterDto;
import com.sixstar.raidu.domain.userpage.service.UserpageService;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/raidu/userpage")
@RequiredArgsConstructor
public class UserpageController {
  private final UserpageService userpageService;
  private final BaseResponseService baseResponseService;

  @PostMapping("/register")
  public ResponseEntity<BaseResponse<?>> register(@RequestHeader("Authorization") String authorization, @Valid @RequestBody UserprofileRegisterDto userprofileRegisterDto) {
    userpageService.register(authorization, userprofileRegisterDto);
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.USERPROFILE_REGISTER_SUCCESS);
  }
}
