package com.sixstar.raidu.domain.users.security;

import com.sixstar.raidu.domain.users.entity.User;
import com.sixstar.raidu.domain.users.repository.UserRepository;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService{

    private final UserRepository userRepository;

    @Transactional
    @Override
    public void saveRefreshToken(String email, String refreshToken) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new BaseException(BaseFailureResponse.USER_NOT_FOUND));
        user.updateRefreshToken(refreshToken);
    }
}
