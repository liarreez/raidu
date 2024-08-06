package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.rooms.entity.RoundRecord;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoundRecordResponseDto {

  private Integer roundNumber;
  private Integer exerciseCount;
  private String exerciseUrlImage;

  @Builder
  public RoundRecordResponseDto(Integer roundNumber, Integer exerciseCount,
      String exerciseUrlImage) {
    this.roundNumber = roundNumber;
    this.exerciseCount = exerciseCount;
    this.exerciseUrlImage = exerciseUrlImage;
  }

  public static RoundRecordResponseDto fromEntity(RoundRecord roundRecord) {
    return RoundRecordResponseDto.builder()
        .roundNumber(roundRecord.getRoundNumber())
        .exerciseCount(roundRecord.getExerciseCount())
        .exerciseUrlImage(roundRecord.getDictionary().getImageUrl())
        .build();
  }
}
