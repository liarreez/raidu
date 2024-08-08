package com.sixstar.raidu.domain.userpage.dto;

import com.sixstar.raidu.domain.main.entity.Region;
import com.sixstar.raidu.domain.main.entity.Season;
import com.sixstar.raidu.domain.rooms.entity.SeasonUserScore;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@NoArgsConstructor
public class UserResponseDto {
    Long id;
    String nickname;
    Long regionId;
    int currentSeasonUserScore;

    @Builder
    public UserResponseDto(Long id, String nickname, Long regionId, int currentSeasonUserScore){
        this.id = id;
        this.nickname = nickname;
        this.regionId = regionId;
        this.currentSeasonUserScore = currentSeasonUserScore;
    }

    public static UserResponseDto fromEntity(SeasonUserScore seasonUserScore, int score){
        return UserResponseDto.builder()
            .id(seasonUserScore.getUserProfile().getId())
            .nickname(seasonUserScore.getUserProfile().getNickname())
            .regionId(seasonUserScore.getUserProfile().getRegion().getId())
            .currentSeasonUserScore(score)
            .build();
    }
}
