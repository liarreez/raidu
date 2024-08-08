package com.sixstar.raidu.global.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixstar.raidu.domain.users.security.JWTFilter;
import com.sixstar.raidu.domain.users.security.JWTUtil;
import com.sixstar.raidu.domain.users.security.LoginFilter;
import com.sixstar.raidu.domain.users.security.SecurityExceptionHandlerFilter;
import com.sixstar.raidu.domain.users.security.SecurityService;
import com.sixstar.raidu.domain.users.service.UsersService;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import java.util.Arrays;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextHolderFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

  private final AuthenticationConfiguration authenticationConfiguration;
  private final JWTUtil jwtUtil;
  private final SecurityService securityService;
  private final BaseResponseService baseResponseService;
  private final ObjectMapper objectMapper;

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
      throws Exception {
    return configuration.getAuthenticationManager();
  }

  @Bean
  public BCryptPasswordEncoder bCryptPasswordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .addFilterBefore(new SecurityExceptionHandlerFilter(), SecurityContextHolderFilter.class)
        .cors(Customizer.withDefaults())
        .csrf(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .formLogin(AbstractHttpConfigurer::disable)
        .logout(AbstractHttpConfigurer::disable)
        .headers(headers -> headers.frameOptions(FrameOptionsConfig::disable).disable())
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/raidu/admin/**").hasRole("ADMIN")
            .requestMatchers("/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs",
                "/api-docs/**",
                "/v3/api-docs/**").permitAll()
            .requestMatchers("/", "/index.html", "/error", "/login", "/api/raidu/users/register",
                "/api/raidu/users/login", "/api/raidu/users/social-register",
                "/api/raidu/users/social-login", "/api/raidu/users/refresh-token",
                "/api/raidu/users/check-email", "/api/raidu/users/recover", "/api/raidu/users/temp-pass"
                , "/public/**", "/static/**", "/resources/**", "/webjars/**", "/enter/**",
                "/api/ws/**")
            .permitAll()
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .anyRequest().authenticated())
        .exceptionHandling(exceptionHandling -> exceptionHandling
            .accessDeniedHandler((request, response, accessDeniedException) -> {
              throw new BaseException(BaseFailureResponse.IS_NOT_ADMIN);
            })
        )
        .addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
        .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil,
                securityService, objectMapper, baseResponseService),
            UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(
        Arrays.asList("http://localhost:3000", "http://localhost:5173",
            "https://i11a108.p.ssafy.io:4443",
            "https://i11a108.p.ssafy.io:3000", "https://i11a108.p.ssafy.io"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowCredentials(true);
    configuration.setAllowedHeaders(Collections.singletonList("*"));
    configuration.setMaxAge(3600L);
    configuration.setExposedHeaders(Collections.singletonList("Authorization"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}