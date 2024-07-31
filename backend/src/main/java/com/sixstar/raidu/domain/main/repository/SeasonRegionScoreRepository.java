package com.sixstar.raidu.domain.main.repository;

import com.sixstar.raidu.domain.main.entity.SeasonRegionScore;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeasonRegionScoreRepository extends JpaRepository<SeasonRegionScore, Long> {

  List<SeasonRegionScore> findBySeasonId(Long id);
}
