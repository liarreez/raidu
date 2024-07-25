package com.sixstar.raidu.domain.rooms.service;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import java.util.Map;

public interface RoomService {
    Map<String, Object> createRoom(RoomCreateRequest request);
}
