package com.sixstar.raidu.domain.admin.dto;

import com.sixstar.raidu.domain.main.entity.Region;
import com.sixstar.raidu.domain.main.entity.Season;
import com.sixstar.raidu.domain.main.entity.SeasonRegionScore;

public class SeasonRegionScoreCreateRequest {
    private Region region;
    private Season season;
    private Long score;

    public static SeasonRegionScore toEntity(Region region, Season season, Long score){
        return SeasonRegionScore.builder()
            .region(region)
            .season(season)
            .score(score)
            .build();
    }
}
