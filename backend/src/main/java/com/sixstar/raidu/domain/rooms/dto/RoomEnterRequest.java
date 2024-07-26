package com.sixstar.raidu.domain.rooms.dto;

import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.entity.RoomUser;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class RoomEnterRequest {
    Long roomId;
    String userEmail;

    public RoomUser toEntity(RoomEnterRequest request, Room room, UserProfile userProfile){
        return RoomUser.builder()
            .room(room)
            .userProfile(userProfile)
            .build();
    }

}
