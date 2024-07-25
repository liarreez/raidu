package com.sixstar.raidu.domain.userpage.entity;

import com.sixstar.raidu.domain.admin.entity.Report;
import com.sixstar.raidu.domain.main.entity.Region;
import com.sixstar.raidu.domain.rooms.entity.ExerciseRoomRecord;
import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.entity.RoomUser;
import com.sixstar.raidu.domain.rooms.entity.SeasonUserScore;
import com.sixstar.raidu.domain.users.entity.User;
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
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(name = "userprofile")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class UserProfile {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @OneToOne
  @JoinColumn(name = "uuid", nullable = false)
  private User user;
  @Column(nullable = false, unique = true)
  private String email;
  @Column(nullable = false, unique = true)
  private String nickname;
  @OneToOne
  @JoinColumn(name = "region_id", nullable = false)
  private Region region;
  @Column(nullable = false)
  private Integer level;
  @Column(nullable = false)
  private Integer exp;
  @Column(nullable = false)
  private Integer bestScore;
  @Column(nullable = false)
  private LocalDateTime bestScoreUpdatedAt;
  private String profileImageUrl;
  private String backGroundImageUrl;
  private String monsterBadgeURl;
  @LastModifiedDate
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @OneToMany(mappedBy = "reportedUser")
  private List<Report> reportsReported;
  @OneToMany(mappedBy = "reportingUser")
  private List<Report> reportsReporting;
  @OneToMany(mappedBy = "userProfile")
  private List<ExerciseRoomRecord> exerciseRoomRecords;
  @OneToMany(mappedBy = "userProfile")
  private List<Room> rooms;
  @OneToMany(mappedBy = "userProfile")
  private List<RoomUser> roomUsers;
  @OneToMany(mappedBy = "userProfile")
  private List<UserMonster> userMonsters;
  @OneToMany(mappedBy = "userProfile")
  private List<UserBossMonster> userBossMonsters;
  @OneToOne(mappedBy = "userProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
  private SeasonUserScore seasonUserScore;

  @PrePersist
  public void prePersist() {
    this.level = this.level == null ? 1: this.level;
    this.exp = this.exp == null ? 0: this.exp;
    this.bestScore = this.bestScore == null ? 0: this.bestScore;
    this.bestScoreUpdatedAt = this.bestScoreUpdatedAt == null ? LocalDateTime.now() : this.bestScoreUpdatedAt;
  }

  @Builder
  public UserProfile(User user, String email, String nickname, Region region, Integer level,
      Integer exp, Integer bestScore, LocalDateTime bestScoreUpdatedAt, String profileImageUrl,
      String backGroundImageUrl, String monsterBadgeURl,
      List<Report> reportsReported, List<Report> reportsReporting,
      List<ExerciseRoomRecord> exerciseRoomRecords, List<Room> rooms, List<RoomUser> roomUsers,
      List<UserMonster> userMonsters, List<UserBossMonster> userBossMonsters,
      SeasonUserScore seasonUserScore) {
    this.user = user;
    this.email = email;
    this.nickname = nickname;
    this.region = region;
    this.level = level;
    this.exp = exp;
    this.bestScore = bestScore;
    this.bestScoreUpdatedAt = bestScoreUpdatedAt;
    this.profileImageUrl = profileImageUrl;
    this.backGroundImageUrl = backGroundImageUrl;
    this.monsterBadgeURl = monsterBadgeURl;
    this.reportsReported = reportsReported;
    this.reportsReporting = reportsReporting;
    this.exerciseRoomRecords = exerciseRoomRecords;
    this.rooms = rooms;
    this.roomUsers = roomUsers;
    this.userMonsters = userMonsters;
    this.userBossMonsters = userBossMonsters;
    this.seasonUserScore = seasonUserScore;
  }
}
