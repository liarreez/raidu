//package com.sixstar.raidu.domain.users.security;
//
//import com.sixstar.raidu.domain.users.entity.User;
//import com.sixstar.raidu.domain.users.repository.UserRepository;
//import java.util.Optional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class CustomUserDetailService implements UserDetailsService {
//
//    private final UserRepository userRepository;
//
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        Optional<User> member = userRepository.findByEmail(email);
//        return member.map(CustomUserDetails::new).orElse(null);
//    }
//}
