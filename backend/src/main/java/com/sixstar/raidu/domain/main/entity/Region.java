package com.sixstar.raidu.domain.main.entity;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "region")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Region {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String name;
  private String symbolImageUrl;
  private String description;
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @OneToMany(mappedBy = "region")
  private List<SeasonRegionScore> seasonRegionScores;
  @OneToOne(mappedBy = "region",  cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
  private UserProfile userProfile;

  @PrePersist
  public void prePersist() {
    this.updatedAt = this.updatedAt == null ? LocalDateTime.now() : this.updatedAt;
  }

  @Builder

  public Region(String name, String symbolImageUrl, String description, LocalDateTime updatedAt,
      List<SeasonRegionScore> seasonRegionScores, UserProfile userProfile) {
    this.name = name;
    this.symbolImageUrl = symbolImageUrl;
    this.description = description;
    this.updatedAt = updatedAt;
    this.seasonRegionScores = seasonRegionScores;
    this.userProfile = userProfile;
  }
}
