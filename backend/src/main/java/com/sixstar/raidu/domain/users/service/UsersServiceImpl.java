package com.sixstar.raidu.domain.users.service;

import com.sixstar.raidu.domain.users.dto.UserRegisterDto;
import com.sixstar.raidu.domain.users.entity.EmailCode;
import com.sixstar.raidu.domain.users.entity.User;
import com.sixstar.raidu.domain.users.enums.TokenType;
import com.sixstar.raidu.domain.users.repository.EmailCodeRepository;
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
    private final EmailCodeRepository emailCodeRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;
    private final JavaMailSender javaMailSender;

    @Transactional
    @Override
    public Map<String, Object> register(UserRegisterDto userRegisterDto) {
//        isCorrectEmailAuthCode(userRegisterDto.getEmail(), userRegisterDto.getCode());
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
        User user = getUserByEmail(email);

        MimeMessage message = javaMailSender.createMimeMessage();
        String tempPassword = generateTempPassword();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message,false,"utf-8");
            helper.setTo(email);
            helper.setSubject("Raidu 임시 비밀번호");
            helper.setText("귀하의 임시 비밀번호는 " + tempPassword + " 입니다. 로그인 후 비밀번호를 변경해 주세요.",true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new BaseException(BaseFailureResponse.EMAIL_SEND_ERROR);
        }
        javaMailSender.send(message);

        user.setPassword(bCryptPasswordEncoder.encode(tempPassword));
    }

    @Override
    public void sendEmailAuthCode(String email) {
        MimeMessage message = javaMailSender.createMimeMessage();
        String emailAuthCode = generateEmailAuthCode();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message,false,"utf-8");
            helper.setTo(email);
            helper.setSubject("Raidu 이메일 인증 코드");
            helper.setText("귀하의 이메일 인증 코드는 " + emailAuthCode + " 입니다. 유효시간 3분 이내에 입력 후 회원가입해주세요",true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new BaseException(BaseFailureResponse.EMAIL_SEND_ERROR);
        }
        javaMailSender.send(message);

        EmailCode emailCode = EmailCode.builder()
            .email(email)
            .code(emailAuthCode)
            .build();

        emailCodeRepository.save(emailCode);
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

    private String generateEmailAuthCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 2; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        for (int i = 0; i < 4; i++) {
            sb.append(numbers.charAt(random.nextInt(numbers.length())));
        }
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

    private void isCorrectEmailAuthCode(String email, String code) {
        if (!code.equals(emailCodeRepository.findCodeByEmail(email))) {
            throw new BaseException(BaseFailureResponse.IS_NOT_CORRECT_EMAIL_AUTH_CODE);
        }
    }
}
