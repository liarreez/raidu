package com.sixstar.raidu.domain.admin.entity;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
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
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
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

  @CreatedDate
  @Column(nullable = false)
  private LocalDateTime reportDate;


  @Builder
  public Report(UserProfile reportedUser, UserProfile reportingUser, String reportReason) {
    this.reportedUser = reportedUser;
    this.reportingUser = reportingUser;
    this.reportReason = reportReason;
  }
}
