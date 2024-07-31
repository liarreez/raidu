package com.sixstar.raidu.domain.userpage.service;

import com.sixstar.raidu.domain.userpage.dto.UserprofileRegisterDto;

public interface UserpageService {

  void register(String authorization, UserprofileRegisterDto userprofileRegisterDto);
}
