package com.sixstar.raidu.domain.main.entity;

import com.sixstar.raidu.domain.rooms.entity.SeasonUserScore;
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
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "season")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Season {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String name;
  @Column(nullable = false)
  private LocalDateTime startDate;
  @Column(nullable = false)
  private LocalDateTime endDate;
  @OneToMany(mappedBy = "season")
  private List<SeasonRegionScore> seasonRegionScores;
  @OneToMany(mappedBy = "season")
  private List<SeasonUserScore> seasonUserScores;
  @OneToMany(mappedBy = "season")
  private List<BossMonster> bossMonsters;

  @Builder
  public Season(String name, LocalDateTime startDate, LocalDateTime endDate) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  @Override
  public String toString() {
    return super.toString();
  }
}
