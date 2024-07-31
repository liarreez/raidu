package com.sixstar.raidu.domain.userpage.dto;

import com.sixstar.raidu.domain.main.entity.Region;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.users.entity.User;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserprofileRegisterDto {
  @Pattern(regexp = "^.{2,6}$", message = "닉네임은 2~6글자까지 설정 가능합니다!")
  private String nickname;
  private String region;

  @Builder
  public UserprofileRegisterDto(String nickname, String region) {
    this.nickname = nickname;
    this.region = region;
  }

  public static UserProfile toEntity(UserprofileRegisterDto userprofileRegisterDto, User user, Region region) {
    return UserProfile.builder()
        .user(user)
        .email(user.getEmail())
        .nickname(userprofileRegisterDto.getNickname())
        .region(region)
        .build();
  }
}
