package com.sixstar.raidu.domain.userpage.repository;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByEmail(String email);

  boolean existsByNickname(String nickname);

  boolean existsByEmail(String email);

  @Query("SELECT DISTINCT up FROM UserProfile up")
  List<UserProfile> findDistinctUserProfiles();
}
