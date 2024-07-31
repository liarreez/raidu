package com.sixstar.raidu.domain.rooms.controller;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.dto.UpdateRoomSettingsRequest;
import com.sixstar.raidu.domain.rooms.service.RoomService;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
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
        Map<String, Object> response = roomService.enterRoom(roomId, email);
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.ROOM_ENTER_SUCCESS, response);
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

    @PutMapping("/{roomId}/settings")
    public ResponseEntity<BaseResponse<?>> updateRoomSettings(@PathVariable("roomId") Long roomId, @RequestBody UpdateRoomSettingsRequest updateRoomSettingsRequest){
        Map<String, Object> response = roomService.updateRoomSettings(roomId, updateRoomSettingsRequest);
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.UPDATE_ROOM_SETTINGS_SUCCESS, response);
    }

    @PatchMapping("/{roomId}/status")
    public ResponseEntity<BaseResponse<?>> updateRoomStatus(@PathVariable("roomId") Long roomId){
        Map<String, Object> response = roomService.updateRoomStatus(roomId);
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.UPDATE_ROOM_STATUS_SUCCESS, response);
    }

    /**
     * RequestBody의 "customSessionId"를 담아서 보내면
     * sessionId를 설정할 수 있음
     */
    @PostMapping("/sessions")
    public ResponseEntity<BaseResponse<?>> initializeSession(@RequestBody(required = false) Map<String, Object> params)
        throws OpenViduJavaClientException, OpenViduHttpException {
        Map<String, Object> response = roomService.initializeSession(params);
        System.out.println(response);
        System.out.println(response.get("sessionId"));
        return baseResponseService.getSuccessResponse(
            BaseSuccessResponse.INIT_SESSION_SUCCESS, response);
    }

    @PostMapping("/sessions/{sessionId}/connections")
    public ResponseEntity<BaseResponse<?>> createConnection(@PathVariable("sessionId") String sessionId,
        @RequestBody(required = false) Map<String, Object> params)
        throws OpenViduJavaClientException, OpenViduHttpException {
        Map<String, Object> response = roomService.createConnection(sessionId, params);
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.CREATE_CONNECTION_SUCCESS, response);
    }


}
