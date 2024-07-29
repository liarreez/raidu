package com.sixstar.raidu.domain.rooms.entity;

import com.sixstar.raidu.domain.main.entity.Season;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "season_user_score")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class SeasonUserScore {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne
  @JoinColumn(name = "season_id", nullable = false)
  private Season season;
  @OneToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UserProfile userProfile;
  @Column(nullable = false)
  private Integer score;

  @PrePersist
  public void prePersist() {
    this.score = this.score == null ? 0 : this.score;
  }

  @Builder
  public SeasonUserScore(Season season, UserProfile userProfile, Integer score) {
    this.season = season;
    this.userProfile = userProfile;
    this.score = score;
  }
}
