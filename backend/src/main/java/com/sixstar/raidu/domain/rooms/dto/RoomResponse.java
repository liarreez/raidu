package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.rooms.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class RoomResponse {
    private Long id;
    private String title;
    private int maxParticipants;
    private boolean isPublic;
    private int roundTime;
    private int restTime;
    private int totalRounds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status;

    public RoomResponse(Room room){
        this.id = room.getId();
        this.title = room.getTitle();
        this.maxParticipants = room.getMaxParticipants();
        this.isPublic = room.getIsPublic();
        this.roundTime = room.getRoundTime();
        this.restTime = room.getRestTime();
        this.totalRounds = room.getTotalRounds();
        this.createdAt = room.getCreatedAt();
        this.updatedAt = room.getUpdatedAt();
        this.status = room.getStatus();
    }
}
