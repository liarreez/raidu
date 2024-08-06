package com.sixstar.raidu.domain.main.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "season_region_score")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class SeasonRegionScore {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne
  @JoinColumn(name = "region_id", nullable = false)
  private Region region;
  @ManyToOne
  @JoinColumn(name = "season_id", nullable = false)
  private Season season;
  @Column(nullable = false)
  private Long score;

  @PrePersist
  public void prePersist(){
    this.score = this.score == null ? 0 : this.score;
  }

  @Builder
  public SeasonRegionScore(Region region, Season season, Long score) {
    this.region = region;
    this.season = season;
    this.score = score;
  }

  public void updateSeasonRegionScore(int personalCombatPower){
    this.score += personalCombatPower;
  }
}
