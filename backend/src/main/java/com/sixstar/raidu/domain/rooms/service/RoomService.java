package com.sixstar.raidu.domain.rooms.service;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.dto.UpdateRoomSettingsRequest;

import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import java.util.Map;

public interface RoomService {
    Map<String, Object> createRoom(RoomCreateRequest request);
    Map<String, Object> enterRoom(Long roomId, String email);
    Map<String, Object> findAllWaitingRooms();
    Map<String, Object> exitRoom(Long roomId, String email);
    Map<String, Object> updateRoomSettings(Long roomId, UpdateRoomSettingsRequest updateRoomSettingsRequest);
    Map<String, Object> updateRoomStatus(Long roomId);
    Map<String, Object> initializeSession(Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException;
}
