package com.sixstar.raidu.domain.admin.service;

import com.sixstar.raidu.domain.admin.dto.SeasonRegionScoreCreateRequest;
import com.sixstar.raidu.domain.admin.dto.SeasonRequest;
import com.sixstar.raidu.domain.admin.dto.SeasonUserScoreCreateRequest;
import com.sixstar.raidu.domain.main.entity.Region;
import com.sixstar.raidu.domain.main.entity.Season;
import com.sixstar.raidu.domain.main.entity.SeasonRegionScore;
import com.sixstar.raidu.domain.main.repository.RegionRepository;
import com.sixstar.raidu.domain.main.repository.SeasonRegionScoreRepository;
import com.sixstar.raidu.domain.main.repository.SeasonRepository;
import com.sixstar.raidu.domain.rooms.entity.SeasonUserScore;
import com.sixstar.raidu.domain.rooms.repository.SeasonUserScoreRepository;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService{

    private final SeasonRepository seasonRepository;
    private final RegionRepository regionRepository;
    private final SeasonUserScoreRepository seasonUserScoreRepository;
    private final SeasonRegionScoreRepository seasonRegionScoreRepository;
    private final UserProfileRepository userProfileRepository;

    public AdminServiceImpl(SeasonRepository seasonRepository, RegionRepository regionRepository,
        SeasonUserScoreRepository seasonUserScoreRepository,
        SeasonRegionScoreRepository seasonRegionScoreRepository,
        UserProfileRepository userProfileRepository) {
        this.seasonRepository = seasonRepository;
        this.regionRepository = regionRepository;
        this.seasonUserScoreRepository = seasonUserScoreRepository;
        this.seasonRegionScoreRepository = seasonRegionScoreRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public Season findSeasonByIdOrThrow(Long seasonId){
        return seasonRepository.findById(seasonId)
                .orElseThrow(()-> new BaseException(BaseFailureResponse.SEASON_NOT_FOUND));
    }

    public LocalDateTime stringToLocalDate(String date){
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(date, dateFormatter);
        return localDate.atStartOfDay();
    }

    public void initializeSeasonRegionScore(Long seasonId){
        Season season = findSeasonByIdOrThrow(seasonId);

        List<Region> regionList = regionRepository.findAll();
        for(Region region: regionList){
            SeasonRegionScore seasonRegionScore = SeasonRegionScoreCreateRequest.toEntity(region, season, 0L);
            seasonRegionScoreRepository.save(seasonRegionScore);
        }
    }

    public void initializeSeasonUserScore(Long seasonId){
        Season season = findSeasonByIdOrThrow(seasonId);

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        for(UserProfile userProfile: userProfileList){
            SeasonUserScore seasonUserScore = SeasonUserScoreCreateRequest.toEntity(season, userProfile, 0);
            seasonUserScoreRepository.save(seasonUserScore);
        }
    }

    @Override
    public Map<String, Object> createSeason(SeasonRequest request) {
        LocalDateTime startDateTime = stringToLocalDate(request.getStartDate());
        LocalDateTime endDateTime = stringToLocalDate(request.getEndDate());

        boolean existsOverlappingSeason
                = seasonRepository.existsOverlappingSeason(startDateTime, endDateTime);
        if(existsOverlappingSeason){
            throw new BaseException(BaseFailureResponse.OVERLAPPING_SEASON_EXISTS);
        }

        Season season = new Season(request.getName(), startDateTime, endDateTime);
        Season createdSeason = seasonRepository.save(season);
        initializeSeasonRegionScore(createdSeason.getId());
        initializeSeasonUserScore(createdSeason.getId());

        Map<String, Object> map = new HashMap<>();
        map.put("createdSeason", createdSeason);
        return map;
    }
}
