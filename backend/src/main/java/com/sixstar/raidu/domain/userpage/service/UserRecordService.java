package com.sixstar.raidu.domain.userpage.service;

import java.util.Map;

public interface UserRecordService {
    Map<String, Object> getUserRecords(Long userId, String time);
}
