package com.sixstar.raidu.domain.users.dto;

import com.sixstar.raidu.domain.users.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserRegisterDto {
  @NotBlank(message = "이메일을 입력하세요!")
  // 이메일 형식 아이디@도메인이름.최상위도메인
  @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,50}$", message = "유효하지 않은 이메일입니다!")
  private String email;
  @NotBlank(message = "비밀번호를 입력하세요!")
  @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=]).{8,20}$", message = "유효하지 않은 비밀번호입니다!")
  private String password;
//  private String code;


  @Builder
  public UserRegisterDto(String email, String password) {
    this.email = email;
    this.password = password;
  }

//  @Builder
//  public UserRegisterDto(String email, String password, String code) {
//    this.email = email;
//    this.password = password;
//    this.code = code;
//  }

  public static User toEntity(UserRegisterDto memberRegisterDto) {
    return User.builder()
        .email(memberRegisterDto.getEmail())
        .password(memberRegisterDto.getPassword())
        .build();
  }
}
