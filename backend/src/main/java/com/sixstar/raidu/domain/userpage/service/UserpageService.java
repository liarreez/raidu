package com.sixstar.raidu.domain.userpage.service;

import com.sixstar.raidu.domain.userpage.dto.UserprofileRegisterDto;
import java.util.Map;

public interface UserpageService {

  void register(String authorization, UserprofileRegisterDto userprofileRegisterDto);

  Map<String, Object> searchUserInfo(String authorization);
}
