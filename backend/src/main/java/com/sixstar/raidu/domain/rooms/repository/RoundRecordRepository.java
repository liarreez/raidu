package com.sixstar.raidu.domain.rooms.repository;

import com.sixstar.raidu.domain.rooms.entity.RoundRecord;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoundRecordRepository extends JpaRepository<RoundRecord, Long> {
    List<RoundRecord> findByExerciseRoomRecordId(Long exerciseRoomRecordId);
}
