package com.sixstar.raidu.domain.admin.dto;

import com.sixstar.raidu.domain.main.entity.Season;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class SeasonRequest {
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public static Season toEntity(SeasonRequest request){
        return Season.builder()
            .name(request.name)
            .startDate(request.startDate)
            .endDate(request.endDate)
            .build();
    }
}
