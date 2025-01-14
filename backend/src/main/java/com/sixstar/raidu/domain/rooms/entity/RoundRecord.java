package com.sixstar.raidu.domain.rooms.entity;

import com.sixstar.raidu.domain.dictionary.entity.Dictionary;
import com.sixstar.raidu.domain.rooms.dto.RoundRecordSaveRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "round_record")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class RoundRecord {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne
  @JoinColumn(name = "exercise_room_record_id", nullable = false)
  private ExerciseRoomRecord exerciseRoomRecord;
  @Column(nullable = false)
  private Integer roundNumber;
  @ManyToOne
  @JoinColumn(name = "dictionary_id", nullable = false)
  private Dictionary dictionary;
  @Column(nullable = false)
  private Integer exerciseCount;

  @Builder
  public RoundRecord(ExerciseRoomRecord exerciseRoomRecord, Integer roundNumber,
      Dictionary dictionary, Integer exerciseCount) {
    this.exerciseRoomRecord = exerciseRoomRecord;
    this.roundNumber = roundNumber;
    this.dictionary = dictionary;
    this.exerciseCount = exerciseCount;
  }

  public RoundRecord toEntity(ExerciseRoomRecord exerciseRoomRecord, Dictionary dictionary, RoundRecordSaveRequest request){
    return RoundRecord.builder()
        .exerciseRoomRecord(exerciseRoomRecord)
        .roundNumber(request.getRoundNumber())
        .dictionary(dictionary)
        .exerciseCount(request.getExerciseCount())
        .build();
  }
}
