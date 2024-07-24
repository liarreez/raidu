package com.sixstar.raidu.domain.main.entity;

import com.sixstar.raidu.domain.userpage.entity.UserBossMonster;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bossmonster")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class BossMonster {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String name;
  private String imageUrl;
  @Column(nullable = false)
  private LocalDateTime createdAt;
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @ManyToOne
  @JoinColumn(name = "season_id")
  private Season season;
  @OneToMany(mappedBy = "bossMonster")
  private List<UserBossMonster> userBossMonsters;

  @PrePersist
  public void prePersist() {
    this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
    this.updatedAt = this.updatedAt == null ? LocalDateTime.now() : this.updatedAt;
  }

  @Builder
  public BossMonster(String name, String imageUrl, LocalDateTime createdAt, LocalDateTime updatedAt,
      Season season, List<UserBossMonster> userBossMonsters) {
    this.name = name;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.season = season;
    this.userBossMonsters = userBossMonsters;
  }
}
