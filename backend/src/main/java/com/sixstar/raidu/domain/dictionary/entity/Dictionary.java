package com.sixstar.raidu.domain.dictionary.entity;

import com.sixstar.raidu.domain.rooms.entity.RoundRecord;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
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
  @CreatedDate
  @Column(nullable = false)
  private LocalDateTime createdAt;
  @LastModifiedDate
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @Column(nullable = false)
  private Boolean isPlayable;
  @OneToMany(mappedBy = "dictionary")
  private List<RoundRecord> roundRecords;

  @PrePersist
  public void prePersist() {
    this.isPlayable = this.isPlayable == null ? false : this.isPlayable;
  }

  @Builder
  public Dictionary(String name, String description, String imageUrl, String videoUrl,
       Boolean isPlayable) {
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.videoUrl = videoUrl;
    this.isPlayable = isPlayable;
  }
}
