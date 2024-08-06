package com.sixstar.raidu.domain.users.security;

import com.sixstar.raidu.domain.users.entity.User;
import com.sixstar.raidu.domain.users.repository.UserRepository;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityServiceImpl implements SecurityService {

  private final UserRepository userRepository;

  @Override
  public void saveRefreshToken(String email, String refreshToken) {
    User user = getUserByEmail(email);
    user.updateRefreshToken(refreshToken);
  }

  @Override
  public User getUserByEmail(String email) {
    return userRepository.findByEmail(email).orElseThrow(
        () -> new BaseException(BaseFailureResponse.USER_NOT_FOUND));
  }
}
