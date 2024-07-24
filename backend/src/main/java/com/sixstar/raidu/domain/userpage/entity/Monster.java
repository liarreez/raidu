package com.sixstar.raidu.domain.userpage.entity;

import com.sixstar.raidu.domain.rooms.entity.RoomUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "monster")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Monster {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String name;
  @Column(nullable = false)
  private Integer stage;
  private String imageUrl;
  @Column(nullable = false)
  private LocalDateTime createdAt;
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @OneToMany(mappedBy = "monster")
  private List<UserMonster> userMonsters;

  @PrePersist
  public void prePersist() {
    this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
    this.updatedAt = this.updatedAt == null ? LocalDateTime.now() : this.updatedAt;
  }

  @Builder
  public Monster(String name, Integer stage, String imageUrl, LocalDateTime createdAt,
      LocalDateTime updatedAt, List<UserMonster> userMonsters) {
    this.name = name;
    this.stage = stage;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userMonsters = userMonsters;
  }
}
