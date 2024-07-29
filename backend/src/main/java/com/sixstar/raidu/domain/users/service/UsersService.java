package com.sixstar.raidu.domain.users.service;

import com.sixstar.raidu.domain.users.dto.UserRegisterDto;
import java.util.Map;

public interface UsersService {

  Map<String,Object> register(UserRegisterDto userRegisterDto);

  Map<String, Object> reissue(String authorization);

  void logout(String authorization);
}
