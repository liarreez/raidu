package com.sixstar.raidu.domain.userpage.dto;

import com.sixstar.raidu.domain.main.dto.BossMonsterResponseDto;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserMonstersResponseDto {
    private List<MonsterResponseDto> monsterResponseDtos;
    private List<BossMonsterResponseDto> bossMonsterResponseDtos;

    @Builder
    public UserMonstersResponseDto(List<MonsterResponseDto> monsterResponseDtos,
                                   List<BossMonsterResponseDto> bossMonsterResponseDtos) {
        this.monsterResponseDtos = monsterResponseDtos;
        this.bossMonsterResponseDtos = bossMonsterResponseDtos;
    }

    public static UserMonstersResponseDto fromEntity(UserProfile userProfile) {
        return UserMonstersResponseDto.builder()
                .monsterResponseDtos(userProfile.getUserMonsters().stream()
                        .map(userMonster -> MonsterResponseDto.fromEntity(userMonster.getMonster()))
                        .collect(Collectors.toList()))
                .bossMonsterResponseDtos(userProfile.getUserBossMonsters().stream()
                        .map(userBossMonster -> BossMonsterResponseDto.fromEntity(userBossMonster.getBossMonster()))
                        .collect(Collectors.toList()))
                .build();
    }
}
