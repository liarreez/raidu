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
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(name = "boss_monster")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class BossMonster {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String name;
  private String imageUrl;
  @CreatedDate
  @Column(nullable = false)
  private LocalDateTime createdAt;
  @LastModifiedDate
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @Column(nullable = false)
  private Long hp;
  @ManyToOne
  @JoinColumn(name = "season_id")
  private Season season;
  @OneToMany(mappedBy = "bossMonster")
  private List<UserBossMonster> userBossMonsters;

  @Builder
  public BossMonster(String name, String imageUrl,
      Season season, List<UserBossMonster> userBossMonsters, Long hp) {
    this.name = name;
    this.imageUrl = imageUrl;
    this.season = season;
    this.userBossMonsters = userBossMonsters;
    this.hp = hp;
  }
}
