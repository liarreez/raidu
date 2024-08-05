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
        this.uuid = userProfile.getId();;
        this.email = userProfile.getEmail();
        this.nickname = userProfile.getNickname();
        this.level = userProfile.getLevel();
        this.bestScore = userProfile.getBestScore();
        this.profileImageUrl = userProfile.getProfileImageUrl();
        this.monsterBadgeURl = userProfile.getMonsterBadgeUrl();
    }
}
