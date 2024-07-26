package com.sixstar.raidu.domain.rooms.service;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.dto.RoomEnterRequest;
import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.entity.RoomUser;
import com.sixstar.raidu.domain.rooms.repository.RoomRepository;
import com.sixstar.raidu.domain.rooms.repository.RoomUserRepository;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class RoomServiceImpl implements RoomService{
    private final RoomRepository roomRepository;
    private final UserProfileRepository userProfileRepository;
    private final RoomUserRepository roomUserRepository;

    public RoomServiceImpl(RoomRepository roomRepository, UserProfileRepository userProfileRepository, RoomUserRepository roomUserRepository){
        this.roomRepository = roomRepository;
        this.userProfileRepository = userProfileRepository;
        this.roomUserRepository = roomUserRepository;
    }

    @Override
    public Map<String, Object> createRoom(RoomCreateRequest request) {
        UserProfile userProfile = userProfileRepository.findByEmail(request.getHostEmail())
            .orElseThrow(()-> new BaseException(BaseFailureResponse.USER_NOT_FOUND));

        Room room = request.toEntity(request, userProfile);
        Room savedRoom = roomRepository.save(room);

        RoomUser roomUser = new RoomUser(room, userProfile);
        RoomUser savedRoomUser = roomUserRepository.save(roomUser);

        Map<String, Object> map = new HashMap<>();
        map.put("roomId", savedRoom.getId());
        map.put("title", savedRoom.getTitle());
        return map;
    }

    @Override
    public void enterRoom(Long roomId, String email) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(()->new BaseException(BaseFailureResponse.ENTER_ROOM_FAIL));
        UserProfile userProfile = userProfileRepository.findByEmail(email)
            .orElseThrow(()-> new BaseException(BaseFailureResponse.USER_NOT_FOUND));

        RoomUser roomUser = new RoomUser(room, userProfile);

        Boolean isExist = roomUserRepository.existsByRoomIdAndUserProfileId(roomId, userProfile.getId());
        if(isExist){
            throw new BaseException(BaseFailureResponse.ENTER_ROOM_FAIL);
        }
        RoomUser savedRoomUser = roomUserRepository.save(roomUser);
    }
}
