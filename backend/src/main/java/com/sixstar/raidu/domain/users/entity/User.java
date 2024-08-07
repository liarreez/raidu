package com.sixstar.raidu.domain.users.entity;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.users.enums.Roles;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long uuid;
  @Setter
  private String password;
  @Column(nullable = false, unique = true)
  private String email;
  @Setter
  @Column(nullable = false)
  private Boolean isActive;
  @Column(nullable = false)
  private Boolean isReported;
  @Column(nullable = false)
  private String role;
  private String socialType;
  private String socialId;
  private String refreshToken;
  @CreatedDate
//  @Column(nullable = false)
  private LocalDateTime createdAt;
  @LastModifiedDate
//  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
  private UserProfile userProfile;


  @PrePersist
  public void prePersist() {
    this.isActive = this.isActive == null ? true: this.isActive;
    this.isReported = this.isReported == null ? false: this.isReported;
    this.role = this.role == null ? Roles.ROLE_USER.name() : this.role;
  }

  @Builder
  public User(String password, String email, String role,
      String socialType, String socialId, String refreshToken) {
    this.password = password;
    this.email = email;
    this.role = role;
    this.socialType = socialType;
    this.socialId = socialId;
    this.refreshToken = refreshToken;
  }

  public void updateRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
  }

}
