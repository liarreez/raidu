package com.sixstar.raidu.domain.rooms.service;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.dto.RoomEnterRequest;
import java.util.Map;

public interface RoomService {
    Map<String, Object> createRoom(RoomCreateRequest request);
    void enterRoom(Long roomId, String email);
}
