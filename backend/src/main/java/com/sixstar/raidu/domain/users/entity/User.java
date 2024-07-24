package com.sixstar.raidu.domain.users.entity;

import com.sixstar.raidu.domain.rooms.entity.RoundRecord;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
@Table(name = "user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long uuid;
  private String password;
  @Column(nullable = false, unique = true)
  private String email;
  @Column(nullable = false)
  private Boolean isActive;
  @Column(nullable = false)
  private String role;
  private String socialType;
  private String socialId;
  private String refreshToken;
  @Column(nullable = false)
  private LocalDateTime createdAt;
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
  private UserProfile userProfile;


  @PrePersist
  public void prePersist() {
    this.isActive = this.isActive == null ? true: this.isActive;
    this.role = this.role == null ? "user" : this.role;
    this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
    this.updatedAt = this.updatedAt == null ? LocalDateTime.now() : this.updatedAt;
  }

  @Builder
  public User(String password, String email, boolean isActive, String role,
      String socialType, String socialId, String refreshToken, LocalDateTime createdAt,
      LocalDateTime updatedAt) {
    this.password = password;
    this.email = email;
    this.isActive = isActive;
    this.role = role;
    this.socialType = socialType;
    this.socialId = socialId;
    this.refreshToken = refreshToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
