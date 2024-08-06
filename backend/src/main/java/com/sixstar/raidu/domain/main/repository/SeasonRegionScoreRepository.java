package com.sixstar.raidu.domain.main.repository;

import com.sixstar.raidu.domain.main.entity.Region;
import com.sixstar.raidu.domain.main.entity.Season;
import com.sixstar.raidu.domain.main.entity.SeasonRegionScore;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SeasonRegionScoreRepository extends JpaRepository<SeasonRegionScore, Long> {
  List<SeasonRegionScore> findBySeasonId(Long id);
  SeasonRegionScore findBySeasonAndRegion(Season season, Region region);
}
