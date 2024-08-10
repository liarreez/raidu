package com.sixstar.raidu.domain.main.dto;

import com.sixstar.raidu.domain.main.entity.Region;
import com.sixstar.raidu.domain.main.entity.SeasonRegionScore;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegionResponseDto {
    Long id;
    String name;
    String symbolImageUrl;

    @Builder
    public RegionResponseDto(Long id, String name, String symbolImageUrl){
        this.id = id;
        this.name = name;
        this.symbolImageUrl = symbolImageUrl;
    }

    public static RegionResponseDto fromEntity(Region region){
        return RegionResponseDto.builder()
            .id(region.getId())
            .name(region.getName())
            .symbolImageUrl(region.getSymbolImageUrl())
            .build();
    }
}
