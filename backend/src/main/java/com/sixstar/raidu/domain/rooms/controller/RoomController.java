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
import org.springframework.web.bind.annotation.*;

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

    @GetMapping()
    public ResponseEntity<BaseResponse<?>> findAllWaitingRooms(){
        Map<String, Object> response = roomService.findAllWaitingRooms();
        return response.containsKey("message") ? baseResponseService.getSuccessResponse(BaseSuccessResponse.NO_WAITING_ROOMS, response.get("message"))
                : baseResponseService.getSuccessResponse(BaseSuccessResponse.GET_WAITING_ROOMS_SUCCESS, response);
    }

    @DeleteMapping("/{roomId}/{email}")
    public ResponseEntity<BaseResponse<?>> exitRoom(@PathVariable("roomId") Long roomId, @PathVariable("email") String email){
        Map<String, Object> response = roomService.exitRoom(roomId, email);
        return response.containsKey("roomId") ? baseResponseService.getSuccessResponse(BaseSuccessResponse.EXIT_HOST, response)
                : baseResponseService.getSuccessResponse(BaseSuccessResponse.EXIT_PARTICIPANT, response);
    }
}
