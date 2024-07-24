package com.sixstar.raidu.domain.userpage.repository;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

}
