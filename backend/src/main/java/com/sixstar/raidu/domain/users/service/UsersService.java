package com.sixstar.raidu.domain.users.service;

import com.sixstar.raidu.domain.users.dto.UserRegisterDto;
import com.sixstar.raidu.domain.users.entity.User;
import java.util.Map;

public interface UsersService {

  User getUserByEmail(String email);

  Map<String,Object> register(UserRegisterDto userRegisterDto);

  Map<String, Object> reissue(String authorization);

  void logout(String authorization);
}
