package com.sixstar.raidu.domain.userpage.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
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
  @CreatedDate
  @Column(nullable = false)
  private LocalDateTime createdAt;
  @LastModifiedDate
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @OneToMany(mappedBy = "monster")
  private List<UserMonster> userMonsters;


  @Builder
  public Monster(String name, Integer stage, String imageUrl,  List<UserMonster> userMonsters) {
    this.name = name;
    this.stage = stage;
    this.imageUrl = imageUrl;
    this.userMonsters = userMonsters;
  }
}
