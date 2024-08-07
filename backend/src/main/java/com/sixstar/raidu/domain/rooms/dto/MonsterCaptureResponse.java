package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.userpage.entity.Monster;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class MonsterCaptureResponse {
    String name;
    String imageUrl;
    boolean isNew;

    @Builder
    public MonsterCaptureResponse(String name, String imageUrl, boolean isNew) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.isNew = isNew;
    }

    public static MonsterCaptureResponse fromEntity(Monster monster, boolean isNew){
        return MonsterCaptureResponse.builder()
            .name(monster.getName())
            .imageUrl(monster.getImageUrl())
            .isNew(isNew)
            .build();
    }
}
