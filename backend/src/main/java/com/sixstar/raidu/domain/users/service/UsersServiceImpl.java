package com.sixstar.raidu.domain.users.service;

import com.sixstar.raidu.domain.users.dto.UserRegisterDto;
import com.sixstar.raidu.domain.users.entity.User;
import com.sixstar.raidu.domain.users.enums.TokenType;
import com.sixstar.raidu.domain.users.repository.UserRepository;
import com.sixstar.raidu.domain.users.security.AuthorizationHeaderParser;
import com.sixstar.raidu.domain.users.security.JWTUtil;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(
            () -> new BaseException(BaseFailureResponse.USER_NOT_FOUND));
    }

    @Transactional
    @Override
    public Map<String, Object> register(UserRegisterDto userRegisterDto) {
        boolean isExist = userRepository.existsByEmail(userRegisterDto.getEmail());
        if (isExist) {
            throw new BaseException(BaseFailureResponse.EMAIL_IS_DUPLICATED);
        }
        String encrypt = bCryptPasswordEncoder.encode(userRegisterDto.getPassword());
        userRegisterDto.setPassword(encrypt);
        User member = UserRegisterDto.toEntity(userRegisterDto);
        userRepository.save(member);
        Map<String, Object> data = new HashMap<>();
        data.put("uuid", member.getUuid());
        data.put("email", member.getEmail());
        return data;
    }

    @Transactional
    @Override
    public Map<String, Object> reissue(String authorization) {
        String token = AuthorizationHeaderParser.parseTokenFromAuthorizationHeader(authorization);

        String email = jwtUtil.getEmail(token);
        String role = jwtUtil.getRole(token);

        if (jwtUtil.isExpired(token)) {
            throw new BaseException(BaseFailureResponse.REFRESH_TOKEN_IS_EXPIRED);
        }

        User user = getUserByEmail(email);

        if (!TokenType.REFRESH.name().equals(jwtUtil.getCategory(token)) || user.getRefreshToken() == null
                || !user.getRefreshToken().equals(token)) {
            throw new BaseException(BaseFailureResponse.INVALID_REFRESH_TOKEN);
        }

        String newAccessToken = jwtUtil.createJwt(TokenType.ACCESS.name(), email, role, 60 * 60 * 1L);
        String newRefreshToken = jwtUtil.createJwt(TokenType.REFRESH.name(), email, role, 60 * 60 * 24L);
        user.updateRefreshToken(newRefreshToken);

        Map<String, Object> data = new HashMap<>();
        data.put("accessToken", newAccessToken);
        data.put("refreshToken", newRefreshToken);

        return data;
    }

    @Transactional
    @Override
    public void logout(String authorization) {
        String token = AuthorizationHeaderParser.parseTokenFromAuthorizationHeader(authorization);

        String email = jwtUtil.getEmail(token);
        User user = getUserByEmail(email);

        user.updateRefreshToken(null);
    }
}
