package com.sixstar.raidu.domain.rooms.controller;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.service.RoomService;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/raidu/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final BaseResponseService baseResponseService;

    @PostMapping
    public ResponseEntity<BaseResponse<?>> createRoom(@RequestBody RoomCreateRequest request){
        Map<String, Object> response = roomService.createRoom(request);
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.ROOM_CREATE_SUCCESS, response);
    }

    @PostMapping("/{roomId}/{email}")
    public ResponseEntity<BaseResponse<?>> enterRoom(@PathVariable("roomId") Long roomId, @PathVariable("email") String email){
        roomService.enterRoom(roomId, email);
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.ROOM_ENTER_SUCCESS);
    }
}
