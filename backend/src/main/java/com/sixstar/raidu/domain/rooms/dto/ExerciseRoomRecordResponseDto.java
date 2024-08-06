package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.rooms.entity.ExerciseRoomRecord;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ExerciseRoomRecordResponseDto {
    private LocalDateTime endTime;
    private Integer personalCombatPower;
    private Integer totalCombatPower;
    private Integer participantsCount;
    private Integer stage;
    private List<RoundRecordResponseDto> roundRecordResponseDtos;

    @Builder
    public ExerciseRoomRecordResponseDto(LocalDateTime endTime, Integer personalCombatPower, Integer totalCombatPower,
                                 Integer participantsCount, Integer stage,
                                 List<RoundRecordResponseDto> roundRecordResponseDtos) {
        this.endTime = endTime;
        this.personalCombatPower = personalCombatPower;
        this.totalCombatPower = totalCombatPower;
        this.participantsCount = participantsCount;
        this.stage = stage;
        this.roundRecordResponseDtos = roundRecordResponseDtos;
    }

    public static ExerciseRoomRecordResponseDto fromEntity(ExerciseRoomRecord exerciseRoomRecord) {
        return ExerciseRoomRecordResponseDto.builder()
                .endTime(exerciseRoomRecord.getEndTime())
                .personalCombatPower(exerciseRoomRecord.getPersonalCombatPower())
                .totalCombatPower(exerciseRoomRecord.getTotalCombatPower())
                .participantsCount(exerciseRoomRecord.getParticipantsCount())
                .roundRecordResponseDtos(exerciseRoomRecord.getRoundRecords().stream()
                        .map(RoundRecordResponseDto::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}
