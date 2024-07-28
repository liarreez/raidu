package com.sixstar.raidu.domain.rooms.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class RoomEnterResponse {
    Long uuid;
    String email;
    String nickname;
    int level;
    int bestScore;
    String profileImageUrl;
    String monsterBadgeURl;
}
