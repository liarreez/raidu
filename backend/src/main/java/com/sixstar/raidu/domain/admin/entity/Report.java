package com.sixstar.raidu.domain.admin.entity;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "report")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Report {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne
  @JoinColumn(name = "reported_user_id", nullable = false)
  private UserProfile reportedUser;
  @ManyToOne
  @JoinColumn(name = "reporting_user_id", nullable = false)
  private UserProfile reportingUser;
  @Column(nullable = false)
  private String reportReason;
  @Column(nullable = false)
  private LocalDateTime reportDate;

  @PrePersist
  public void prePersist() {
    this.reportDate = this.reportDate == null ? LocalDateTime.now() : this.reportDate;
  }

  @Builder
  public Report(UserProfile reportedUser, UserProfile reportingUser, String reportReason,
      LocalDateTime reportDate) {
    this.reportedUser = reportedUser;
    this.reportingUser = reportingUser;
    this.reportReason = reportReason;
    this.reportDate = reportDate;
  }
}
