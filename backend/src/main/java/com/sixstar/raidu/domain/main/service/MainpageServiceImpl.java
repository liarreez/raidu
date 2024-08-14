package com.sixstar.raidu.domain.main.service;

import com.sixstar.raidu.domain.main.entity.BossMonster;
import com.sixstar.raidu.domain.main.entity.Season;
import com.sixstar.raidu.domain.main.entity.SeasonRegionScore;
import com.sixstar.raidu.domain.main.repository.BossMonsterRepository;
import com.sixstar.raidu.domain.main.repository.SeasonRegionScoreRepository;
import com.sixstar.raidu.domain.main.repository.SeasonRepository;
import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
import com.sixstar.raidu.domain.users.security.JWTUtil;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MainpageServiceImpl implements MainpageService{

  private final JWTUtil jwtUtil;
  private final UserProfileRepository userProfileRepository;
  private final SeasonRepository seasonRepository;
  private final SeasonRegionScoreRepository seasonRegionScoreRepository;
  private final BossMonsterRepository bossMonsterRepository;

  @Override
  public Map<String, Object> retrieve(String authorization) {
    Season currentSeason = getCurrentSeason();
    BossMonster bossMonster = getBossMonster(currentSeason.getId());

    Map<String, Object> data = new HashMap<>();
    data.put("userCount", getUserCount());
    data.put("regionScores", getSeasonContribution(currentSeason));
    data.put("bossMonsterName", bossMonster.getName());
    data.put("bossMonsterImg", bossMonster.getImageUrl());
    data.put("bossMonsterDescription", bossMonster.getDescription());
    data.put("bossMonsterHp", bossMonster.getHp());
    data.put("totalContribute", getTotalContribute(currentSeason));

    return data;
  }

  private Long getUserCount() {
    return userProfileRepository.count();
  }

  private Season getCurrentSeason() {
    LocalDate currentDate = LocalDate.now();
    return seasonRepository.findAll().stream()
        .filter(season -> !currentDate.isBefore(season.getStartDate().toLocalDate()) && !currentDate.isAfter(season.getEndDate().toLocalDate()))
        .findFirst()
        .orElseThrow(() -> new BaseException(BaseFailureResponse.SEASON_NOT_FOUND));
  }

  private List<Map<String, Object>> getSeasonContribution(Season currentSeason) {
    List<SeasonRegionScore> scores = seasonRegionScoreRepository.findBySeasonId(currentSeason.getId());

    return scores.stream()
        .map(score -> {
          Map<String, Object> contributionMap = new HashMap<>();
          contributionMap.put("regionId", score.getRegion().getId());
          contributionMap.put("regionName", score.getRegion().getName());
          contributionMap.put("season", score.getSeason().getId());
          contributionMap.put("seasonName", score.getSeason().getName());
          contributionMap.put("score", score.getScore());
          return contributionMap;
        })
        .collect(Collectors.toList());
  }

  public Long getTotalContribute(Season currentSeason) {
    List<SeasonRegionScore> scores = seasonRegionScoreRepository.findBySeasonId(currentSeason.getId());

    return scores.stream()
        .mapToLong(SeasonRegionScore::getScore)
        .sum();
  }

  private BossMonster getBossMonster(Long seasonId) {
    return bossMonsterRepository.findBySeasonIdAndIsMainbossTrue(seasonId)
        .orElseThrow(() -> new BaseException(BaseFailureResponse.BOSSMONSTER_NOT_FOUND));
  }
}
