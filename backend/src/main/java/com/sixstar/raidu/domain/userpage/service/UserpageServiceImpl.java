package com.sixstar.raidu.domain.userpage.service;

import com.sixstar.raidu.domain.main.entity.Region;
import com.sixstar.raidu.domain.main.repository.RegionRepository;
import com.sixstar.raidu.domain.rooms.dto.ExerciseRoomRecordResponseDto;
import com.sixstar.raidu.domain.userpage.dto.UserMonstersResponseDto;
import com.sixstar.raidu.domain.userpage.dto.UserProfileResponseDto;
import com.sixstar.raidu.domain.userpage.dto.UserprofileRegisterDto;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
import com.sixstar.raidu.domain.users.entity.User;
import com.sixstar.raidu.domain.users.repository.UserRepository;
import com.sixstar.raidu.domain.users.security.AuthorizationHeaderParser;
import com.sixstar.raidu.domain.users.security.JWTUtil;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserpageServiceImpl implements UserpageService {

  private final UserProfileRepository userProfileRepository;
  private final UserRepository userRepository;
  private final RegionRepository regionRepository;
  private final JWTUtil jwtUtil;

  @Transactional
  @Override
  public void register(String authorization,
      UserprofileRegisterDto userprofileRegisterDto) {
    String email = getEmailFromAuth(authorization);
    String nickname = userprofileRegisterDto.getNickname();
    User user = getUserByEmail(email);
    Region region = regionRepository.findByName(userprofileRegisterDto.getRegion())
        .orElseThrow(() -> new BaseException(BaseFailureResponse.REGION_NOT_FOUND));
    if (userProfileRepository.existsByNickname(nickname)) {
      throw new BaseException(BaseFailureResponse.NICKNAME_IS_DUPLICATED);
    }

    UserProfile userProfile = UserprofileRegisterDto.toEntity(userprofileRegisterDto, user, region);
    if (userProfileRepository.existsByEmail(email)) {
      throw new BaseException(BaseFailureResponse.SETTING_IS_REGISTERED);
    } else {
      userProfileRepository.save(userProfile);
    }
  }

  @Override
  public Map<String, Object> searchUserInfo(String authorization) {
    String token = AuthorizationHeaderParser.parseTokenFromAuthorizationHeader(authorization);

    String email = jwtUtil.getEmail(token);
    UserProfile userProfile = userProfileRepository.findByEmail(email)
        .orElseThrow(() -> new BaseException(BaseFailureResponse.USERPROFILE_NOT_FOUND));
    Map<String, Object> data = new HashMap<>();
    data.put("userProfile", UserProfileResponseDto.fromEntity(userProfile));
    return data;
  }

  @Override
  public Map<String, Object> searchUserData(long id) {
    UserProfile userProfile = userProfileRepository.findById(id)
        .orElseThrow(() -> new BaseException(BaseFailureResponse.USERPROFILE_NOT_FOUND));

    Map<String, Object> data = new HashMap<>();
    data.put("userProfile", UserProfileResponseDto.fromEntity(userProfile));
    data.put("exerciseRoomRecord", userProfile.getExerciseRoomRecords().stream()
        .map(ExerciseRoomRecordResponseDto::fromEntity)
        .collect(Collectors.toList()));
    data.put("userMonsters", UserMonstersResponseDto.fromEntity(userProfile));

    return data;
  }

  @Transactional
  @Override
  public void withdraw(String authorization) {
    String email = getEmailFromAuth(authorization);
    User user = getUserByEmail(email);
    user.setIsActive(false);
  }

  private String getEmailFromAuth(String authorization) {
    String token = AuthorizationHeaderParser.parseTokenFromAuthorizationHeader(authorization);
    return jwtUtil.getEmail(token);
  }

  private User getUserByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new BaseException(BaseFailureResponse.USER_NOT_FOUND));
  }
}
