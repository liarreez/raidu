package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
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

    public RoomEnterResponse fromEntity(UserProfile userProfile){
        return new RoomEnterResponse(
            userProfile.getId(),
            userProfile.getEmail(),
            userProfile.getNickname(),
            userProfile.getLevel(),
            userProfile.getBestScore(),
            userProfile.getProfileImageUrl(),
            userProfile.getMonsterBadgeUrl()
        );
    }
}
