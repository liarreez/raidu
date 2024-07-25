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
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "exerciseroomrecord")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ExerciseRoomRecord {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UserProfile userProfile;
  @ManyToOne
  @JoinColumn(name = "room_id", nullable = false)
  private Room room;
  @Column(nullable = false)
  private LocalDateTime endTime;
  @Column(nullable = false)
  private Integer personalCombatPower;
  @Column(nullable = false)
  private Integer totalCombatPower;
  @Column(nullable = false)
  private Integer participantsCount;
  @Column(nullable = false)
  private Integer stage;
  @OneToMany(mappedBy = "exerciseRoomRecord")
  private List<RoundRecord> roundRecords;

  @PrePersist
  public void prePersist() {
    this.endTime = this.endTime == null ? LocalDateTime.now() : this.endTime;
  }


  @Builder
  public ExerciseRoomRecord(UserProfile userProfile, Room room, LocalDateTime endTime,
      Integer personalCombatPower, Integer totalCombatPower, Integer participantsCount,
      List<RoundRecord> roundRecords, Integer stage) {
    this.userProfile = userProfile;
    this.room = room;
    this.endTime = endTime;
    this.personalCombatPower = personalCombatPower;
    this.totalCombatPower = totalCombatPower;
    this.participantsCount = participantsCount;
    this.roundRecords = roundRecords;
    this.stage = stage;
  }
}
