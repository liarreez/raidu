package com.sixstar.raidu.domain.rooms.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomCreateResponse {
    private Long roomId;
    private String title;
}
