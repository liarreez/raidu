package com.sixstar.raidu.domain.main.repository;

import com.sixstar.raidu.domain.main.entity.Season;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface SeasonRepository extends JpaRepository<Season, Long> {
    @Query("SELECT s FROM Season s WHERE :endTime BETWEEN s.startDate and s.endDate")
    Optional<Season> findSeason(@Param("endTime")LocalDateTime endTime);
}
