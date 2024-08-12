package com.sixstar.raidu.domain.userpage.service;

import com.sixstar.raidu.domain.dictionary.repository.DictionaryRepository;
import com.sixstar.raidu.domain.rooms.entity.ExerciseRoomRecord;
import com.sixstar.raidu.domain.rooms.entity.RoundRecord;
import com.sixstar.raidu.domain.rooms.repository.ExerciseRoomRecordRepository;
import com.sixstar.raidu.domain.rooms.repository.RoundRecordRepository;
import com.sixstar.raidu.domain.userpage.dto.UserRecordResponseDto;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
import com.sixstar.raidu.domain.users.repository.UserRepository;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserRecordServiceImpl implements UserRecordService {

    private final ExerciseRoomRecordRepository exerciseRoomRecordRepository;
    private final RoundRecordRepository roundRecordRepository;
    private final DictionaryRepository dictionaryRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    public Map<String, Object> getUserRecords(Long userId, String time) {
        UserProfile userProfile = userProfileRepository.findById(userId)
            .orElseThrow(() -> new BaseException(BaseFailureResponse.USERPROFILE_NOT_FOUND));
            LocalDateTime requestedTime = LocalDateTime.parse(time);
            List<ExerciseRoomRecord> exerciseRoomRecords = exerciseRoomRecordRepository
                    .findAllByUserProfile_IdAndEndTimeBetween(userId, requestedTime, requestedTime.plusDays(1));;
            Map<String, Object> data = new HashMap<>();
            data.put("data", UserRecordResponseDto.fromEntity(requestedTime, exerciseRoomRecords));
            return data;
    }

}
