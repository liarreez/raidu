package com.sixstar.raidu.domain.admin.service;

import com.sixstar.raidu.domain.admin.dto.SeasonRequest;
import java.util.Map;

public interface AdminService {

    Map<String, Object> createSeason(SeasonRequest request);
}
