package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.rooms.entity.Room;
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
}
