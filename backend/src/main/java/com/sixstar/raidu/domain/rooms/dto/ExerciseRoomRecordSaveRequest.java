package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.rooms.entity.ExerciseRoomRecord;
import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.entity.RoundRecord;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;

import java.time.LocalDateTime;
import java.util.List;

public class ExerciseRoomRecordSaveRequest {
    private Long id;
    private UserProfile userProfile;
    private Room room;
    private LocalDateTime endTime;
    private Integer personalCombatPower;
    private Integer totalCombatPower;
    private Integer participantsCount;
    private Integer stage;
    private List<RoundRecord> roundRecords;

    public static ExerciseRoomRecord toEntity(UserProfile userProfile, Room room, RoomCompleteRequest request){
        return ExerciseRoomRecord.builder()
                .userProfile(userProfile)
                .room(room)
                .endTime(request.getEndTime())
                .personalCombatPower(request.getPersonalCombatPower())
                .totalCombatPower(request.getTotalCombatPower())
                .participantsCount(request.getParticipantsCount())
                .stage(request.getStage())
                .build();
    }
}
