package com.sixstar.raidu.domain.users.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import com.sixstar.raidu.global.response.BaseResponse;
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
            if (exception instanceof BaseException baseException) {
                handleBaseException(response, baseException);
            } else {
                handleException(response, exception);
            }
        }
    }

    private void handleBaseException(HttpServletResponse response, BaseException baseException) throws IOException {
        response.setStatus(baseException.getBaseResponseStatus().getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        BaseResponse baseResponse = BaseResponse.builder()
                .status(baseException.getBaseResponseStatus().getStatus())
                .message(baseException.getBaseResponseStatus().getMessage())
                .build();
        try (var writer = response.getWriter()) {
            new ObjectMapper().writeValue(writer, baseResponse);
        }
    }

    private void handleException(HttpServletResponse response, Exception exception) throws IOException {
        response.setStatus(BaseFailureResponse.INTERNAL_SERVER_ERROR.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        BaseResponse baseResponse = BaseResponse.builder()
                .status(BaseFailureResponse.INTERNAL_SERVER_ERROR.getStatus())
                .message(BaseFailureResponse.INTERNAL_SERVER_ERROR.getMessage())
                .build();
        try (var writer = response.getWriter()) {
            new ObjectMapper().writeValue(writer, baseResponse);
        }
    }
}
