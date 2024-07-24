package com.sixstar.raidu.domain.userpage.entity;

import com.sixstar.raidu.domain.main.entity.BossMonster;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "userbossmonster")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class UserBossMonster {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne
  @JoinColumn(name = "user_profile_id", nullable = false)
  private UserProfile userProfile;
  @ManyToOne
  @JoinColumn(name = "boss_monster_id", nullable = false)
  private BossMonster bossMonster;
  @Column(nullable = false)
  private LocalDateTime capturedAt;

  @PrePersist
  public void prePersist() {
    this.capturedAt = this.capturedAt == null ? LocalDateTime.now() : this.capturedAt;
  }

  @Builder
  public UserBossMonster(UserProfile userProfile, BossMonster bossMonster) {
    this.userProfile = userProfile;
    this.bossMonster = bossMonster;
  }
}
