package com.sixstar.raidu.domain.users.service;

import com.sixstar.raidu.domain.users.dto.UserRegisterDto;
import com.sixstar.raidu.domain.users.entity.User;
import com.sixstar.raidu.domain.users.repository.UserRepository;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements  UsersService {

  private final UserRepository userRepository;
  private final BCryptPasswordEncoder bCryptPasswordEncoder;

  @Override
  public Map<String, Object> register(UserRegisterDto userRegisterDto) {
    boolean isExist = userRepository.existsByEmail(userRegisterDto.getEmail());
    if (isExist) {
      throw new BaseException(BaseFailureResponse.DuplicateEmailException);
    }
    String encrypt = bCryptPasswordEncoder.encode(userRegisterDto.getPassword());
    userRegisterDto.setPassword(encrypt);
    User member = UserRegisterDto.toEntity(userRegisterDto);
    userRepository.save(member);
    Map<String, Object> data = new HashMap<>();
    data.put("uuid", member.getUuid());
    data.put("email", member.getEmail());
    return data;
  }
}
