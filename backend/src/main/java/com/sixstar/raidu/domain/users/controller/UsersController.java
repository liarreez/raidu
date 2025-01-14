package com.sixstar.raidu.domain.users.controller;

import com.sixstar.raidu.domain.users.dto.EmailRequestDto;
import com.sixstar.raidu.domain.users.dto.UserRegisterDto;
import com.sixstar.raidu.domain.users.service.UsersService;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/raidu/users")
@RequiredArgsConstructor
public class UsersController {

  private final UsersService usersService;
  private final BaseResponseService baseResponseService;

  @PostMapping("/register")
  public ResponseEntity<BaseResponse<?>> register(@Valid @RequestBody UserRegisterDto userRegisterDto) {
    Map<String, Object> data = usersService.register(userRegisterDto);
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.REGISTER_SUCCESS, data);
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<BaseResponse<?>> refresh(@RequestHeader("Authorization") String authorization) {
    Map<String, Object> data = usersService.reissue(authorization);
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.REFRESH_TOKEN_SUCCESS,data);
  }

  @PostMapping("/logout")
  public ResponseEntity<BaseResponse<?>> logout(@RequestHeader("Authorization") String authorization) {
    usersService.logout(authorization);
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.LOGOUT_SUCCESS);
  }

  @PostMapping("/check-email")
  public ResponseEntity<BaseResponse<?>> checkEmail(@RequestBody EmailRequestDto emailRequestDto) {
    usersService.checkEmail(emailRequestDto.getEmail());
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.EMAIL_CHECK_SUCCESS);
  }

  @PostMapping("/temp-pass")
  public ResponseEntity<BaseResponse<?>> sendTempPassword(@RequestBody EmailRequestDto emailRequestDto) {
    usersService.sendTempPassword(emailRequestDto.getEmail());
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.SEND_TEMP_PASSWORD_SUCCESS);
  }

  @PostMapping("/email-auth")
  public ResponseEntity<BaseResponse<?>> sendEmailAuthCode(@RequestBody EmailRequestDto emailRequestDto) {
    usersService.sendEmailAuthCode(emailRequestDto.getEmail());
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.SEND_EMAIL_AUTH_CODE_SUCCESS);
  }
}
