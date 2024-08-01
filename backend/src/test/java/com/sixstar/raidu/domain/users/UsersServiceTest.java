package com.sixstar.raidu.domain.users;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import com.sixstar.raidu.domain.users.dto.UserRegisterDto;
import com.sixstar.raidu.domain.users.entity.User;
import com.sixstar.raidu.domain.users.repository.UserRepository;
import com.sixstar.raidu.domain.users.service.UsersServiceImpl;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UsersServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private BCryptPasswordEncoder bCryptPasswordEncoder;

  @InjectMocks
  private UsersServiceImpl userService;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testRegisterSuccess() {
    UserRegisterDto userRegisterDto = UserRegisterDto.builder()
        .email("test@email.com")
        .password("password")
        .build();

    when(userRepository.existsByEmail(userRegisterDto.getEmail())).thenReturn(false);
    userRegisterDto.setPassword(bCryptPasswordEncoder.encode(userRegisterDto.getPassword()));

    User user = UserRegisterDto.toEntity(userRegisterDto);

    when(userRepository.save(any(User.class))).thenReturn(user);

    Map<String, Object> expectedData = new HashMap<>();
    expectedData.put("uuid", user.getUuid());
    expectedData.put("email", user.getEmail());

    Map<String, Object> result = userService.register(userRegisterDto);

    assertEquals(expectedData, result);
    verify(userRepository).existsByEmail(userRegisterDto.getEmail());
    verify(bCryptPasswordEncoder).encode(userRegisterDto.getPassword());
    verify(userRepository).save(any(User.class));
  }

  @Test
  public void testRegisterEmailAlreadyExists() {
    UserRegisterDto userRegisterDto = UserRegisterDto.builder()
        .email("test@email.com")
        .password("password")
        .build();

    when(userRepository.existsByEmail(userRegisterDto.getEmail())).thenReturn(true);

    BaseException exception = assertThrows(BaseException.class, () -> {
      userService.register(userRegisterDto);
    });

    assertEquals(BaseFailureResponse.EMAIL_IS_DUPLICATED, exception.getBaseResponseStatus());
    verify(userRepository).existsByEmail(userRegisterDto.getEmail());
    verifyNoMoreInteractions(userRepository);
    verifyNoMoreInteractions(bCryptPasswordEncoder);
  }
}
