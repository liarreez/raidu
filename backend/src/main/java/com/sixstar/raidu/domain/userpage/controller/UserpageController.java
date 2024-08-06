package com.sixstar.raidu.domain.userpage.controller;

import com.sixstar.raidu.domain.userpage.dto.UserInfoModifyDto;
import com.sixstar.raidu.domain.userpage.dto.UserprofileRegisterDto;
import com.sixstar.raidu.domain.userpage.service.UserpageService;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/raidu/userpage")
@RequiredArgsConstructor
public class UserpageController {
  private final UserpageService userpageService;
  private final BaseResponseService baseResponseService;

  @GetMapping("")
  public ResponseEntity<BaseResponse<?>> searchUserInfo(@RequestHeader("Authorization") String authorization) {
    Map<String, Object> data = userpageService.searchUserInfo(authorization);
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.USERPROFILE_SEARCH_SUCCESS, data);
  }

  @PostMapping("/register")
  public ResponseEntity<BaseResponse<?>> register(@RequestHeader("Authorization") String authorization, @Valid @RequestBody UserprofileRegisterDto userprofileRegisterDto) {
    userpageService.register(authorization, userprofileRegisterDto);
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.USERPROFILE_REGISTER_SUCCESS);
  }

  @GetMapping("/profile/{id}")
  public ResponseEntity<BaseResponse<?>> searchUserData(@PathVariable("id") long id) {
    Map<String, Object> data = userpageService.searchUserData(id);
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.USERPROFILE_SEARCH_SUCCESS, data);
  }

  @PostMapping("/withdraw")
  public ResponseEntity<BaseResponse<?>> withdraw(@RequestHeader("Authorization") String authorization) {
    userpageService.withdraw(authorization);
    return baseResponseService.getSuccessResponse(BaseSuccessResponse.USER_WITHDRAW_SUCCESS);
  }

  @GetMapping("/list")
  public ResponseEntity<BaseResponse<?>> findUsers(@RequestParam(name="nickname", required = false) String nickname){
    Map<String, Object> data = userpageService.findUsers(nickname);
    return data.containsKey("message") ? baseResponseService.getSuccessResponse(BaseSuccessResponse.GET_USERS_SUCCESS_BUT_NO_CONTENT)
    : baseResponseService.getSuccessResponse(BaseSuccessResponse.GET_USERS_SUCCESS);
  }
}
