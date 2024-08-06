package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.dictionary.entity.Dictionary;
import com.sixstar.raidu.domain.rooms.entity.ExerciseRoomRecord;
import com.sixstar.raidu.domain.rooms.entity.RoundRecord;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.jdbc.object.RdbmsOperation;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class RoundRecordSaveRequest {
    private Integer roundNumber;
    private Long dictionaryId;
    private Integer exerciseCount;

    public static RoundRecord toEntity(ExerciseRoomRecord exerciseRoomRecord, Dictionary dictionary, RoundRecordSaveRequest request){
        return RoundRecord.builder()
                .exerciseRoomRecord(exerciseRoomRecord)
                .roundNumber(request.getRoundNumber())
                .dictionary(dictionary)
                .exerciseCount(request.getExerciseCount())
                .build();
    }
}
