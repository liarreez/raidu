package com.sixstar.raidu.domain.users.security;

import org.springframework.transaction.annotation.Transactional;

public interface RefreshTokenService {
    @Transactional
    void saveRefreshToken(String email, String refreshToken);
}
