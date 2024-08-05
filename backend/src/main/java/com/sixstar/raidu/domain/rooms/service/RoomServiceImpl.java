package com.sixstar.raidu.domain.rooms.service;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.dto.RoomEnterResponse;
import com.sixstar.raidu.domain.rooms.dto.RoomResponse;
import com.sixstar.raidu.domain.rooms.dto.UpdateRoomSettingsRequest;
import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.entity.RoomUser;
import com.sixstar.raidu.domain.rooms.repository.RoomRepository;
import com.sixstar.raidu.domain.rooms.repository.RoomUserRepository;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;

@Service
public class RoomServiceImpl implements RoomService{

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }
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
        roomUserRepository.save(roomUser);

        Map<String, Object> map = new HashMap<>();
        map.put("hostEmail", request.getHostEmail());
        map.put("roomId", savedRoom.getId());
        map.put("title", savedRoom.getTitle());
        return map;
    }

    @Override
    public Map<String, Object> enterRoom(Long roomId, String email) {
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

        roomUserRepository.save(roomUser);
        RoomEnterResponse enteredUser = new RoomEnterResponse().fromEntity(userProfile);

        Map<String, Object> map = new HashMap<>();
        map.put("enteredUser", enteredUser);
        return map;
    }

    @Override
    public Map<String, Object> findAllWaitingRooms() {
        List<RoomResponse> waitingRoomList = roomRepository.findByStatusAndIsPublic("waiting", true)
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

    @Transactional
    @Override
    public Map<String, Object> updateRoomSettings(Long roomId, UpdateRoomSettingsRequest updateRoomSettingsRequest) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(()-> new BaseException(BaseFailureResponse.ROOM_NOT_FOUND));

        room.update(updateRoomSettingsRequest.getRoundTime(), updateRoomSettingsRequest.getRestTime(), updateRoomSettingsRequest.getTotalRounds());
        RoomResponse updatedRoom = new RoomResponse(room);

        Map<String, Object> map = new HashMap<>();
        map.put("updatedRoom", updatedRoom);
        return map;
    }

    @Transactional
    @Override
    public Map<String, Object> updateRoomStatus(Long roomId) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(()-> new BaseException(BaseFailureResponse.ROOM_NOT_FOUND));

        String status = room.getStatus();
        if(status.equals("waiting")){
            room.update("exercise");
        }else if(status.equals("exercise")){
            room.update("completed");
        }

        Map<String, Object> map = new HashMap<>();
        map.put("updatedStatus", room.getStatus());
        return map;
    }

    @Override
    public Map<String, Object> initializeSession(Map<String, Object> params)
        throws OpenViduJavaClientException, OpenViduHttpException {
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);

        Map<String, Object> map = new HashMap<>();
        map.put("sessionId", session.getSessionId());
        System.out.println("sessionId           "+session.getSessionId());
        System.out.println("MAMAMAM     "+map.get("sessionId"));
        return map;
    }

    @Override
    public Map<String, Object> createConnection(String sessionId, Map<String, Object> params)
        throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            throw new BaseException(BaseFailureResponse.SESSION_NOT_FOUND);
        }
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);
        Map<String, Object> map = new HashMap<>();
        map.put("token", connection.getToken());
        System.out.println("token           "+connection.getToken());

        return map;
    }
}
