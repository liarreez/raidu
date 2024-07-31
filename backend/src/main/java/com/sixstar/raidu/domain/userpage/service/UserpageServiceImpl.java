package com.sixstar.raidu.domain.userpage.service;

import com.sixstar.raidu.domain.main.entity.Region;
import com.sixstar.raidu.domain.main.repository.RegionRepository;
import com.sixstar.raidu.domain.userpage.dto.UserprofileRegisterDto;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
import com.sixstar.raidu.domain.users.entity.User;
import com.sixstar.raidu.domain.users.repository.UserRepository;
import com.sixstar.raidu.domain.users.security.AuthorizationHeaderParser;
import com.sixstar.raidu.domain.users.security.JWTUtil;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
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
    String token = AuthorizationHeaderParser.parseTokenFromAuthorizationHeader(authorization);

    String email = jwtUtil.getEmail(token);
    String nickname = userprofileRegisterDto.getNickname();
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new BaseException(BaseFailureResponse.USER_NOT_FOUND));
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
}
