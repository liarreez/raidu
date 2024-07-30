package com.sixstar.raidu.domain.rooms.entity;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "room_user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class RoomUser {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne
  @JoinColumn(name = "room_id", nullable = false)
  private Room room;
  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UserProfile userProfile;

  @Builder
  public RoomUser(Room room, UserProfile userProfile) {
    this.room = room;
    this.userProfile = userProfile;
  }
}
