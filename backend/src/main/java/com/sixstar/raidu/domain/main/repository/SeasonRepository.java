package com.sixstar.raidu.domain.main.repository;

import com.sixstar.raidu.domain.main.entity.Season;
import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface SeasonRepository extends JpaRepository<Season, Long> {
    @Query("SELECT s FROM Season s WHERE :endTime BETWEEN s.startDate and s.endDate")
    Optional<Season> findSeason(@Param("endTime")LocalDateTime endTime);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END " +
        "FROM Season s WHERE (s.startDate < :endDate AND s.endDate > :startDate)")
    boolean existsSeasonsBetweenDates(@Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate);

    boolean existsByName(String name);
}
