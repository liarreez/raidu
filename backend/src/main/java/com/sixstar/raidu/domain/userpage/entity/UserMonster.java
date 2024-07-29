package com.sixstar.raidu.domain.userpage.entity;

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
import org.springframework.data.annotation.CreatedDate;

@Entity
@Table(name = "user_monster")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class UserMonster {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UserProfile userProfile;
  @ManyToOne
  @JoinColumn(name = "monster_id", nullable = false)
  private Monster monster;
  @CreatedDate
  @Column(nullable = false)
  private LocalDateTime capturedAt;


  @Builder
  public UserMonster(UserProfile userProfile, Monster monster) {
    this.userProfile = userProfile;
    this.monster = monster;
  }
}
