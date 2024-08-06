package com.sixstar.raidu.domain.rooms.repository;

import com.sixstar.raidu.domain.main.entity.Season;
import com.sixstar.raidu.domain.rooms.entity.SeasonUserScore;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeasonUserScoreRepository extends JpaRepository<SeasonUserScore, Long> {
    SeasonUserScore findBySeasonAndUserProfile(Season season, UserProfile userProfile);
}
