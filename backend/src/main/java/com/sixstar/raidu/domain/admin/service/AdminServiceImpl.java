package com.sixstar.raidu.domain.admin.service;

import com.sixstar.raidu.domain.admin.dto.SeasonRequest;
import com.sixstar.raidu.domain.main.entity.Season;
import com.sixstar.raidu.domain.main.repository.SeasonRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService{

    private final SeasonRepository seasonRepository;

    public AdminServiceImpl(SeasonRepository seasonRepository) {
        this.seasonRepository = seasonRepository;
    }

    public LocalDateTime stringToLocalDateTime(String date){
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(date, dateFormatter);
        return localDate.atStartOfDay();
    }

    @Override
    public Map<String, Object> createSeason(SeasonRequest request) {

        LocalDateTime startDateTime = stringToLocalDateTime(request.getStartDate());
        LocalDateTime endDateTime = stringToLocalDateTime(request.getEndDate());

        Season season = new Season(request.getName(), startDateTime, endDateTime);

        Season savedSeason = seasonRepository.save(season);
        System.out.println(savedSeason.getName());
        System.out.println(savedSeason.getStartDate());
        System.out.println(savedSeason.getEndDate());

        Map<String, Object> map = new HashMap<>();
        return map;
    }
}
