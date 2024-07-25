package com.sixstar.raidu.domain.rooms.service;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.repository.RoomRepository;
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

    public RoomServiceImpl(RoomRepository roomRepository, UserProfileRepository userProfileRepository){
        this.roomRepository = roomRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public Map<String, Object> createRoom(RoomCreateRequest request) {
        UserProfile userProfile = userProfileRepository.findByEmail(request.getHostEmail())
            .orElseThrow(()-> new BaseException(BaseFailureResponse.USER_NOT_FOUND));

        Room room = request.toEntity(request, userProfile);
        Room savedRoom = roomRepository.save(room);

        Map<String, Object> map = new HashMap<>();
        map.put("roomId", savedRoom.getId());
        map.put("title", savedRoom.getTitle());

        return map;
    }
}
