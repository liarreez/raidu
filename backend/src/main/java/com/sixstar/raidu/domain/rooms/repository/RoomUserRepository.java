package com.sixstar.raidu.domain.rooms.repository;

import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.entity.RoomUser;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.nio.file.attribute.UserPrincipal;
import java.util.Optional;

public interface RoomUserRepository extends JpaRepository<RoomUser, Long> {
    int countByRoomId(Long roomId);
    Boolean existsByRoomIdAndUserProfileId(Long roomId, Long userProfileId);
    void deleteByRoom(Room room);
    Optional<RoomUser> findByRoomAndUserProfile(Room room, UserProfile userProfile);

}
