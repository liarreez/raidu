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
    private String startDate;
    private String endDate;
}
