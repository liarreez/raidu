package com.sixstar.raidu.domain.users.repository;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.users.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
  Boolean existsByEmail(String email);
  Optional<User> findByEmail(String email);

  List<UserProfile> findAll(Specification<UserProfile> spec);
}
