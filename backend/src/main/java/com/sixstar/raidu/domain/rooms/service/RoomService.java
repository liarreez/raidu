package com.sixstar.raidu.domain.rooms.service;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.dto.RoomCreateResponse;

public interface RoomService {
    RoomCreateResponse createRoom(RoomCreateRequest request);
}
