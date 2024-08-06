package com.sixstar.raidu.domain.admin.dto;

import com.sixstar.raidu.domain.main.entity.Season;
import com.sixstar.raidu.domain.rooms.entity.SeasonUserScore;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;

public class SeasonUserScoreCreateRequest {
    private Season season;
    private UserProfile userProfile;
    private Integer score;

    public static SeasonUserScore toEntity(Season season, UserProfile userProfile, int score){
        return SeasonUserScore.builder()
            .season(season)
            .userProfile(userProfile)
            .score(score)
            .build();
    }
}
