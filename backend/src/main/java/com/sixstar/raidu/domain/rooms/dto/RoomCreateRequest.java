package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class RoomCreateRequest {
    String title;
    Integer maxParticipants;
    Boolean isPublic;
    Integer roundTime;
    Integer restTime;
    Integer totalRounds;
    String hostEmail;

    public Room toEntity(RoomCreateRequest request, UserProfile userProfile){
        return Room.builder()
            .title(request.getTitle())
            .maxParticipants(request.getMaxParticipants())
            .isPublic(request.getIsPublic())
            .roundTime(request.getRoundTime())
            .restTime(request.getRestTime())
            .totalRounds(request.getTotalRounds())
            .status("waiting")
            .userProfile(userProfile)
            .build();
    }
}
