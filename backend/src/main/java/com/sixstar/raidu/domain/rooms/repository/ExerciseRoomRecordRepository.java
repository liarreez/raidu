package com.sixstar.raidu.domain.rooms.repository;

import com.sixstar.raidu.domain.rooms.entity.ExerciseRoomRecord;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseRoomRecordRepository extends JpaRepository<ExerciseRoomRecord, Long> {
    // UserProfile의 ID를 기반으로 ExerciseRoomRecord를 조회하는 메서드
    List<ExerciseRoomRecord> findAllByUserProfile_IdAndEndTimeBetween(Long userProfileId, LocalDateTime startTime, LocalDateTime endTime);
}
