package com.sixstar.raidu.domain.users.service;

import com.sixstar.raidu.domain.users.dto.UserRegisterDto;
import com.sixstar.raidu.domain.users.entity.User;
import java.util.Map;

public interface UsersService {

  Map<String,Object> register(UserRegisterDto userRegisterDto);

  Map<String, Object> reissue(String authorization);

  void logout(String authorization);

  void checkEmail(String email);

  void sendTempPassword(String email);

  void sendEmailAuthCode(String email);
}
