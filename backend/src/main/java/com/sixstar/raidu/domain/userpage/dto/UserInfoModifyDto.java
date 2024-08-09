package com.sixstar.raidu.domain.userpage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserInfoModifyDto {
    @Pattern(regexp = "^.{2,10}$", message = "닉네임은 2~10글자까지 설정 가능합니다!")
    private String nickname;
    @NotBlank(message = "비밀번호를 입력하세요!")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=]).{8,20}$", message = "유효하지 않은 비밀번호입니다!")
    private String password;;

    @Builder
    public UserInfoModifyDto(String nickname, String password) {
        this.nickname = nickname;
        this.password = password;
    }
}
