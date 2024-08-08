package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.rooms.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
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

    @Builder
    public RoomResponse(Long id, String title, int maxParticipants, boolean isPublic, int roundTime,
        int restTime, int totalRounds, LocalDateTime createdAt, LocalDateTime updatedAt,
        String status) {
        this.id = id;
        this.title = title;
        this.maxParticipants = maxParticipants;
        this.isPublic = isPublic;
        this.roundTime = roundTime;
        this.restTime = restTime;
        this.totalRounds = totalRounds;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
    }

    public static RoomResponse fromEntity(Room room){
        return RoomResponse.builder()
            .id(room.getId())
            .title(room.getTitle())
            .maxParticipants(room.getMaxParticipants())
            .isPublic(room.getIsPublic())
            .roundTime(room.getRoundTime())
            .restTime(room.getRestTime())
            .totalRounds(room.getTotalRounds())
            .createdAt(room.getCreatedAt())
            .updatedAt(room.getUpdatedAt())
            .status(room.getStatus())
            .build();
    }
}
