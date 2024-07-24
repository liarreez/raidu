package com.sixstar.raidu.domain.dictionary.entity;

import com.sixstar.raidu.domain.rooms.entity.RoundRecord;
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
import org.hibernate.validator.constraints.Currency;

@Entity
@Table(name = "dictionary")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Dictionary {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String name;
  private String description;
  private String imageUrl;
  private String videoUrl;
  @Column(nullable = false)
  private LocalDateTime createdAt;
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @Column(nullable = false)
  private Boolean isPlayable;
  @OneToMany(mappedBy = "dictionary")
  private List<RoundRecord> roundRecords;

  @PrePersist
  public void prePersist() {
    this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
    this.updatedAt = this.updatedAt == null ? LocalDateTime.now() : this.updatedAt;
    this.isPlayable = this.isPlayable == null ? false : this.isPlayable;
  }

  @Builder
  public Dictionary(String name, String description, String imageUrl, String videoUrl,
      LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isPlayable) {
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.videoUrl = videoUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isPlayable = isPlayable;
  }
}
