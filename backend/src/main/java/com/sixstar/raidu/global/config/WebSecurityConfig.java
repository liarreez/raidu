package com.sixstar.raidu.global.config;

import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
import com.sixstar.raidu.domain.users.repository.UserRepository;
import com.sixstar.raidu.domain.users.security.JWTFilter;
import com.sixstar.raidu.domain.users.security.JWTUtil;
import com.sixstar.raidu.domain.users.security.LoginFilter;
import com.sixstar.raidu.domain.users.security.RefreshTokenService;
import com.sixstar.raidu.domain.users.service.UsersService;
import com.sixstar.raidu.global.response.BaseResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

  private final AuthenticationConfiguration authenticationConfiguration;
  private final JWTUtil jwtUtil;
  private final RefreshTokenService refreshTokenService;
  private final BaseResponseService baseResponseService;

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
    return configuration.getAuthenticationManager();
  }

  @Bean
  public BCryptPasswordEncoder bCryptPasswordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(AbstractHttpConfigurer::disable)
        .csrf(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .formLogin(AbstractHttpConfigurer::disable)
        .logout(AbstractHttpConfigurer::disable)

        .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable).disable())

        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        .authorizeHttpRequests((auth) -> auth
            .requestMatchers("/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs"
                , "/api-docs/**", "/v3/api-docs/**")
            .permitAll()
            .requestMatchers("/", "api/raidu/users/register", "api/raidu/users/login"
                , "api/raidu/users/social-register", "api/raidu/users/social-login"
                , "api/raidu/users/refresh-token", "api/raidu/users/check-email", "api/raidu/users/recover")
            .permitAll()
            .anyRequest().authenticated());

    http
        .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

    http
        .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, refreshTokenService, baseResponseService)
            , UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}