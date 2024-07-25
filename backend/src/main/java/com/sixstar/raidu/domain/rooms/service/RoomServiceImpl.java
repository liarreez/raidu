package com.sixstar.raidu.domain.rooms.service;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.dto.RoomCreateResponse;
import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.repository.RoomRepository;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
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
    public RoomCreateResponse createRoom(RoomCreateRequest request) {
        UserProfile userProfile = userProfileRepository.findByEmail(request.getHostEmail())
            .orElseThrow(()-> new IllegalArgumentException("User not found"));

        Room room = Room.builder()
            .title(request.getTitle())
            .maxParticipants(request.getMaxParticipants())
            .isPublic(request.getIsPublic())
            .roundTime(request.getRoundTime())
            .restTime(request.getRestTime())
            .totalRounds(request.getTotalRounds())
            .status("waiting")
            .userProfile(userProfile)
            .build();

        Room savedRoom = roomRepository.save(room);

        System.out.println(room.getCreatedAt());

        return RoomCreateResponse.builder()
            .roomId(savedRoom.getId())
            .title(savedRoom.getTitle())
            .build();
    }
}
