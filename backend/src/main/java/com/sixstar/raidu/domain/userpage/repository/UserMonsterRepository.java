package com.sixstar.raidu.domain.userpage.repository;

import com.sixstar.raidu.domain.userpage.entity.Monster;
import com.sixstar.raidu.domain.userpage.entity.UserMonster;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserMonsterRepository extends JpaRepository<UserMonster, Long> {
    Boolean existsByUserProfileAndMonster(UserProfile userProfile, Monster monster);
}
