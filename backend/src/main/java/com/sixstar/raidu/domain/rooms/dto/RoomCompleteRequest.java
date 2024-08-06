package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.rooms.entity.RoundRecord;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class RoomCompleteRequest {
    String email;
    LocalDateTime endTime;
    int personalCombatPower;
    int totalCombatPower;
    int participantsCount;
    int stage;
    List<RoundRecordSaveRequest> roundRecordList;
}
