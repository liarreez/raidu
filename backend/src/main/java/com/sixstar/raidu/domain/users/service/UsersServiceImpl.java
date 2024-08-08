package com.sixstar.raidu.domain.users.service;

import com.sixstar.raidu.domain.users.dto.UserRegisterDto;
import com.sixstar.raidu.domain.users.entity.User;
import com.sixstar.raidu.domain.users.enums.TokenType;
import com.sixstar.raidu.domain.users.repository.UserRepository;
import com.sixstar.raidu.domain.users.security.AuthorizationHeaderParser;
import com.sixstar.raidu.domain.users.security.JWTUtil;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;
    private final JavaMailSender javaMailSender;

    @Transactional
    @Override
    public Map<String, Object> register(UserRegisterDto userRegisterDto) {
        checkEmail(userRegisterDto.getEmail());
        userRegisterDto.setPassword(bCryptPasswordEncoder.encode(userRegisterDto.getPassword()));
        User member = UserRegisterDto.toEntity(userRegisterDto);
        userRepository.save(member);
        Map<String, Object> data = new HashMap<>();
        data.put("uuid", member.getUuid());
        data.put("email", member.getEmail());
        return data;
    }

    @Transactional
    @Override
    public Map<String, Object> reissue(String authorization) {
        String token = AuthorizationHeaderParser.parseTokenFromAuthorizationHeader(authorization);
        String email = jwtUtil.getEmail(token);
        String role = jwtUtil.getRole(token);
        User user = getUserByEmail(email);

        if (jwtUtil.isExpired(token)) {
            throw new BaseException(BaseFailureResponse.REFRESH_TOKEN_IS_EXPIRED);
        }
        if (!TokenType.REFRESH.name().equals(jwtUtil.getCategory(token)) || user.getRefreshToken() == null
                || !user.getRefreshToken().equals(token)) {
            throw new BaseException(BaseFailureResponse.INVALID_REFRESH_TOKEN);
        }

        String newAccessToken = jwtUtil.createJwt(TokenType.ACCESS.name(), email, role, 60 * 60 * 1L);
        String newRefreshToken = jwtUtil.createJwt(TokenType.REFRESH.name(), email, role, 60 * 60 * 24L);
        user.updateRefreshToken(newRefreshToken);
        Map<String, Object> data = new HashMap<>();
        data.put("accessToken", newAccessToken);
        data.put("refreshToken", newRefreshToken);
        return data;
    }

    @Transactional
    @Override
    public void logout(String authorization) {
        String email = getEmailFromAuth(authorization);
        User user = getUserByEmail(email);

        user.updateRefreshToken(null);
    }

    @Override
    public void checkEmail(String email) {
        if(isDuplicatedEmail(email)) {
            throw new BaseException(BaseFailureResponse.EMAIL_IS_DUPLICATED);
        }
    }

    @Transactional
    @Override
    public void sendTempPassword(String email) {
        MimeMessage message = javaMailSender.createMimeMessage();
        String tempPassword = generateTempPassword();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message,false,"utf-8");
            helper.setTo(email);
            helper.setSubject("Raidu 임시 비밀번호");
            helper.setText("귀하의 임시 비밀번호는 " + tempPassword + " 입니다. 로그인 후 비밀번호를 변경해 주세요.",true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace(); // 에러 출력
        }
        javaMailSender.send(message);

        User user = getUserByEmail(email);
        user.setPassword(bCryptPasswordEncoder.encode(tempPassword));
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String specialChars = "!@#$%^&*";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        sb.append(specialChars.charAt(random.nextInt(specialChars.length())));
        for (int i = 0; i < 4; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        for (int i = 0; i < 4; i++) {
            sb.append(numbers.charAt(random.nextInt(numbers.length())));
        }
        sb.append(specialChars.charAt(random.nextInt(specialChars.length())));
        return sb.toString();
    }

    private String getEmailFromAuth(String authorization) {
        String token = AuthorizationHeaderParser.parseTokenFromAuthorizationHeader(authorization);
        return jwtUtil.getEmail(token);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(
            () -> new BaseException(BaseFailureResponse.USER_NOT_FOUND));
    }

    private boolean isDuplicatedEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
