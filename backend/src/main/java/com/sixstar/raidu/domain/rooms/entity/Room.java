package com.sixstar.raidu.domain.rooms.entity;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "room")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Room {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private String title;
  @Column(nullable = false)
  private Integer maxParticipants;
  @Column(nullable = false)
  private Boolean isPublic;
  @Column(nullable = false)
  private Integer roundTime;
  @Column(nullable = false)
  private Integer restTime;
  @Column(nullable = false)
  private Integer totalRounds;

  @CreatedDate
  @Column(nullable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @Column(nullable = false)
  private String status;
  @ManyToOne
  @JoinColumn(name = "host_id", nullable = false)
  private UserProfile userProfile;
  @OneToMany(mappedBy = "room")
  private List<RoomUser> roomUsers;
  @OneToMany(mappedBy = "room")
  private List<ExerciseRoomRecord> exerciseRoomRecords;

  @PrePersist
  public void prePersist() {
    this.isPublic = this.isPublic == null ? true: this.isPublic;
    this.status = this.status == null ? "wating" : this.status;
  }

  @Builder

  public Room(String title, Integer maxParticipants, Boolean isPublic, Integer roundTime,
      Integer restTime, Integer totalRounds,
      String status, UserProfile userProfile, List<RoomUser> roomUsers,
      List<ExerciseRoomRecord> exerciseRoomRecords) {
    this.title = title;
    this.maxParticipants = maxParticipants;
    this.isPublic = isPublic;
    this.roundTime = roundTime;
    this.restTime = restTime;
    this.totalRounds = totalRounds;
    this.status = status;
    this.userProfile = userProfile;
    this.roomUsers = roomUsers;
    this.exerciseRoomRecords = exerciseRoomRecords;
  }

  public void update(int roundTime, int restTime, int totalRounds){
    this.roundTime = roundTime;
    this.restTime = restTime;
    this.totalRounds = totalRounds;
  }

  public void update(String status){
    this.status = status;
  }
}
