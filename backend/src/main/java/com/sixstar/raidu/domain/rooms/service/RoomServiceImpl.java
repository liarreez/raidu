package com.sixstar.raidu.domain.rooms.service;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.dto.RoomEnterRequest;
import com.sixstar.raidu.domain.rooms.dto.RoomResponse;
import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.entity.RoomUser;
import com.sixstar.raidu.domain.rooms.repository.RoomRepository;
import com.sixstar.raidu.domain.rooms.repository.RoomUserRepository;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.transaction.Transactional;
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

        int currentParticipantsCount = roomUserRepository.countByRoomId(roomId);
        if(currentParticipantsCount>=room.getMaxParticipants()){
            throw new BaseException(BaseFailureResponse.FULL_ROOM);
        }

        RoomUser savedRoomUser = roomUserRepository.save(roomUser);
    }

    @Override
    public Map<String, Object> findAllWaitingRooms() {
        List<RoomResponse> waitingRoomList = roomRepository.findByStatus("waiting")
                .stream()
                .map(RoomResponse::new)
                .toList();
        Map<String, Object> map = new HashMap<>();
        if (waitingRoomList.isEmpty()) {
            map.put("message", "No waiting rooms available.");
        } else {
            map.put("waitingRoomList", waitingRoomList);
        }
        return map;
    }

    @Transactional
    @Override
    public Map<String, Object> exitRoom(Long roomId, String email) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(()->new BaseException(BaseFailureResponse.ROOM_NOT_FOUND));
        UserProfile requestUser = userProfileRepository.findByEmail(email)
                .orElseThrow(()->new BaseException(BaseFailureResponse.USER_NOT_FOUND));

        String hostEmail = room.getUserProfile().getEmail();

        Map<String, Object> map = new HashMap<>();
        // 방장이라면 그 방의 roomUser 모두 삭제한 뒤 room도 삭제
        if(hostEmail.equals(requestUser.getEmail())){
            roomUserRepository.deleteByRoom(room);
            roomRepository.delete(room);
            map.put("roomId", roomId);
        }else{
            RoomUser roomUser = (RoomUser) roomUserRepository.findByRoomAndUserProfile(room, requestUser)
                    .orElseThrow(() -> new BaseException(BaseFailureResponse.ROOM_USER_NOT_FOUND));
            roomUserRepository.delete(roomUser);
        }
        map.put("email", email);
        return map;
    }
}
