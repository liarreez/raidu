package com.sixstar.raidu.domain.rooms.repository;

import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.entity.RoomUser;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomUserRepository extends JpaRepository<RoomUser, Long> {
    int countByRoomId(Long roomId);
    Boolean existsByRoomIdAndUserProfileId(Long roomId, Long userProfileId);
}
