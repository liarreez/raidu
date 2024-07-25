package com.sixstar.raidu.domain.users.controller;

import com.sixstar.raidu.domain.users.dto.UserRegisterDto;
import com.sixstar.raidu.domain.users.service.UsersService;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
}
