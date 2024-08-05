package com.sixstar.raidu.domain.userpage.dto;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserProfileResponseDto {
    private String email;
    private String nickname;
    private String regionName;
    private String symbolImageUrl;
    private Integer level;
    private Integer exp;
    private Integer bestScore;
    private LocalDateTime bestScoreUpdatedAt;
    private String profileImageUrl;
    private String backgroundImageUrl;
    private String monsterBadgeUrl;

    @Builder
    public UserProfileResponseDto(String email, String nickname, String regionName, String symbolImageUrl,
                                  Integer level,
                                  Integer exp, Integer bestScore, LocalDateTime bestScoreUpdatedAt,
                                  String profileImageUrl,
                                  String backgroundImageUrl, String monsterBadgeUrl) {
        this.email = email;
        this.nickname = nickname;
        this.regionName = regionName;
        this.symbolImageUrl = symbolImageUrl;
        this.level = level;
        this.exp = exp;
        this.bestScore = bestScore;
        this.bestScoreUpdatedAt = bestScoreUpdatedAt;
        this.profileImageUrl = profileImageUrl;
        this.backgroundImageUrl = backgroundImageUrl;
        this.monsterBadgeUrl = monsterBadgeUrl;
    }

    public static UserProfileResponseDto fromEntity(UserProfile userProfile) {
        return UserProfileResponseDto.builder()
                .email(userProfile.getEmail())
                .nickname(userProfile.getNickname())
                .regionName(userProfile.getRegion().getName())
                .symbolImageUrl(userProfile.getRegion().getSymbolImageUrl())
                .level(userProfile.getLevel())
                .exp(userProfile.getExp())
                .bestScore(userProfile.getBestScore())
                .bestScoreUpdatedAt(userProfile.getBestScoreUpdatedAt())
                .profileImageUrl(userProfile.getProfileImageUrl())
                .backgroundImageUrl(userProfile.getBackgroundImageUrl())
                .monsterBadgeUrl(userProfile.getMonsterBadgeUrl())
                .build();
    }
}
