package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UpdateRoomSettingsRequest {
    int roundTime;
    int restTime;
    int totalRounds;

    public Room toEntity(UpdateRoomSettingsRequest request, Room room){
        return Room.builder()
                .roundTime(request.getRoundTime())
                .restTime(request.getRestTime())
                .totalRounds(request.getTotalRounds())
                .build();
    }
}
