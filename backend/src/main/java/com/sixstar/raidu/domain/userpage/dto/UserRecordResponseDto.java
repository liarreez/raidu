package com.sixstar.raidu.domain.userpage.dto;

import com.sixstar.raidu.domain.rooms.dto.ExerciseRoomRecordResponseDto;
import com.sixstar.raidu.domain.rooms.entity.ExerciseRoomRecord;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserRecordResponseDto {
    private LocalDateTime end_time;
    private List<ExerciseRoomRecordResponseDto> exerciseRoomRecordResponseDtos;

    @Builder
    public UserRecordResponseDto(LocalDateTime end_time,
        List<ExerciseRoomRecordResponseDto> exerciseRoomRecordResponseDtos) {
        this.end_time = end_time;
        this.exerciseRoomRecordResponseDtos = exerciseRoomRecordResponseDtos;
    }

    public static UserRecordResponseDto fromEntity(LocalDateTime end_time, List<ExerciseRoomRecord> exerciseRoomRecords) {
        return UserRecordResponseDto.builder()
            .end_time(end_time)
            .exerciseRoomRecordResponseDtos(exerciseRoomRecords.stream()
                .map(exerciseRoomRecord -> ExerciseRoomRecordResponseDto.fromEntity(exerciseRoomRecord))
                .toList())
            .build();
    }
}
