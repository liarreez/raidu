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
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

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
  @CreatedDate
  @Column(nullable = false)
  private LocalDateTime createdAt;
  @LastModifiedDate
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
  private UserProfile userProfile;


  @PrePersist
  public void prePersist() {
    this.isActive = this.isActive == null ? true: this.isActive;
    this.role = this.role == null ? "user" : this.role;
  }

  @Builder
  public User(String password, String email, boolean isActive, String role,
      String socialType, String socialId, String refreshToken) {
    this.password = password;
    this.email = email;
    this.isActive = isActive;
    this.role = role;
    this.socialType = socialType;
    this.socialId = socialId;
    this.refreshToken = refreshToken;
  }
}
