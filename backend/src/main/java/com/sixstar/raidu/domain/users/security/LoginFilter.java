package com.sixstar.raidu.domain.users.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixstar.raidu.domain.users.enums.Tokens;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final BaseResponseService baseResponseService;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil
    , RefreshTokenService refreshTokenService, BaseResponseService baseResponseService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.baseResponseService = baseResponseService;
        setUsernameParameter("email");
        setFilterProcessesUrl("/api/raidu/users/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        String email = obtainUsername(request);
        String password = obtainPassword(request);

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(email, password, null);

        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String email = customUserDetails.getUsername();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();

        String role = auth.getAuthority();

        // 토큰은 12시간 유지
        String accessToken = jwtUtil.createJwt(Tokens.ACCESS.name(), email, role, 60*60*1L);
        String refreshToken = jwtUtil.createJwt(Tokens.REFRESH.name(), email, role, 60*60*24L);

        refreshTokenService.saveRefreshToken(email, refreshToken);

        Map<String, Object> data = new HashMap<>();
        data.put("accessToken", accessToken);
        data.put("refreshToken", refreshToken);

        ResponseEntity<BaseResponse<?>> responseEntity = baseResponseService.getSuccessResponse(BaseSuccessResponse.LOGIN_SUCCESS, data);

        response.setStatus(BaseSuccessResponse.LOGIN_SUCCESS.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        try (var writer = response.getWriter()) {
            new ObjectMapper().writeValue(writer, responseEntity.getBody());
        }
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        throw new BaseException(BaseFailureResponse.LOGIN_FAIL);
    }
}