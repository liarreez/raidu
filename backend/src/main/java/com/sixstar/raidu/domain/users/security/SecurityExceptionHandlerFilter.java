package com.sixstar.raidu.domain.users.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import com.sixstar.raidu.global.response.BaseResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

public class SecurityExceptionHandlerFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            if (exception instanceof JwtException jwtException) {
                handleJwtException(response, jwtException);
            }
            if (exception instanceof BaseException baseException) {
                handleBaseException(response, baseException);
            } else {
                handleException(response, exception);
            }
        }
    }

    private void handleBaseException(HttpServletResponse response, BaseException baseException) throws IOException {
        BaseResponse baseResponse = BaseResponse.builder()
                .status(baseException.getBaseResponseStatus().getStatus())
                .message(baseException.getBaseResponseStatus().getMessage())
                .build();
        sendJsonResponse(response, baseResponse);
    }

    private void handleException(HttpServletResponse response, Exception exception) throws IOException {
        BaseResponse baseResponse = BaseResponse.builder()
                .status(BaseFailureResponse.INTERNAL_SERVER_ERROR.getStatus())
                .message(BaseFailureResponse.INTERNAL_SERVER_ERROR.getMessage())
                .build();
        sendJsonResponse(response, baseResponse);
    }

    private void handleJwtException(HttpServletResponse response, JwtException jwtException) throws IOException {
        BaseResponse baseResponse = createBaseResponseForJwtException(jwtException);
        sendJsonResponse(response, baseResponse);
    }

    private BaseResponse createBaseResponseForJwtException(JwtException jwtException) {
        if (jwtException instanceof ExpiredJwtException) {
            return createBaseResponse(BaseFailureResponse.ACCESS_TOKEN_IS_EXPIRED);
        } else if (jwtException instanceof SignatureException) {
            return createBaseResponse(BaseFailureResponse.INVALID_ACCESS_TOKEN_SIGNATURE);
        } else if (jwtException instanceof MalformedJwtException) {
            return createBaseResponse(BaseFailureResponse.INVALID_ACCESS_TOKEN);
        } else {
            return createBaseResponse(BaseFailureResponse.INTERNAL_SERVER_ERROR);
        }
    }

    private BaseResponse createBaseResponse(BaseFailureResponse failureResponse) {
        return BaseResponse.builder()
                .status(failureResponse.getStatus())
                .message(failureResponse.getMessage())
                .build();
    }

    private void sendJsonResponse(HttpServletResponse response, BaseResponse baseResponse) throws IOException {
        response.setStatus(baseResponse.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        try (var writer = response.getWriter()) {
            new ObjectMapper().writeValue(writer, baseResponse);
        }
    }
}
