package com.sixstar.raidu.domain.users.security;

import com.sixstar.raidu.domain.users.entity.User;
import org.springframework.transaction.annotation.Transactional;

public interface SecurityService {
  @Transactional
  void saveRefreshToken(String email, String refreshToken);
  User getUserByEmail(String email);
}
