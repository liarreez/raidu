package com.sixstar.raidu.domain.main.dto;

import com.sixstar.raidu.domain.main.entity.BossMonster;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BossMonsterResponseDto {
    private String name;
    private String imageUrl;
    private Long hp;
    private String description;
    private Boolean isMainboss;
    private String seasonName;

    @Builder
    public BossMonsterResponseDto(String name, String imageUrl, Long hp, String description, Boolean isMainboss,
                                  String seasonName) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.hp = hp;
        this.description = description;
        this.isMainboss = isMainboss;
        this.seasonName = seasonName;
    }

    public static BossMonsterResponseDto fromEntity(BossMonster bossMonster) {
        return BossMonsterResponseDto.builder()
                .name(bossMonster.getName())
                .imageUrl(bossMonster.getImageUrl())
                .hp(bossMonster.getHp())
                .description(bossMonster.getDescription())
                .isMainboss(bossMonster.getIsMainboss())
                .seasonName(bossMonster.getSeason().getName())
                .build();
    }
}
