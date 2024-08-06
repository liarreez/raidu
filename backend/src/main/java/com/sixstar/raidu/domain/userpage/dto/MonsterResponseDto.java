package com.sixstar.raidu.domain.userpage.dto;

import com.sixstar.raidu.domain.userpage.entity.Monster;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MonsterResponseDto {
    private String name;
    private Integer stage;
    private String imageUrl;

    @Builder
    public MonsterResponseDto(String name, Integer stage, String imageUrl) {
        this.name = name;
        this.stage = stage;
        this.imageUrl = imageUrl;
    }

    public static MonsterResponseDto fromEntity(Monster monster) {
        return MonsterResponseDto.builder()
                .name(monster.getName())
                .stage(monster.getStage())
                .imageUrl(monster.getImageUrl())
                .build();
    }
}
