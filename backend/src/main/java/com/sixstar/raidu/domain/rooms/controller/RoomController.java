package com.sixstar.raidu.domain.rooms.controller;

import com.sixstar.raidu.domain.rooms.dto.*;
import com.sixstar.raidu.domain.rooms.entity.Room;
import com.sixstar.raidu.domain.rooms.entity.RoundRecord;
import com.sixstar.raidu.domain.rooms.service.RoomService;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
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
    public ResponseEntity<BaseResponse<?>> findAllWaitingRooms(
        @RequestParam(name="round-time", required = false) Integer roundTime,
        @RequestParam(name="rest-time",required = false) Integer restTime,
        @RequestParam(name="total-rounds",required = false) Integer totalRounds,
        @RequestParam(name="title",required = false) String title
    ){
        Map<String, Object> response = roomService.findAllWaitingRooms(roundTime, restTime, totalRounds, title);
        return response.containsKey("message") ? baseResponseService.getSuccessResponse(BaseSuccessResponse.NO_WAITING_ROOMS, response)
                : baseResponseService.getSuccessResponse(BaseSuccessResponse.GET_WAITING_ROOMS_SUCCESS, response);
    }

    @DeleteMapping("/{roomId}/{email}")
    public ResponseEntity<BaseResponse<?>> exitRoom(@PathVariable("roomId") Long roomId, @PathVariable("email") String email){
        Map<String, Object> response = roomService.exitRoom(roomId, email);
        return response.containsKey("roomId") ? baseResponseService.getSuccessResponse(BaseSuccessResponse.EXIT_HOST, response)
                : baseResponseService.getSuccessResponse(BaseSuccessResponse.EXIT_PARTICIPANT, response);
    }

    @PutMapping("/{roomId}/settings")
    public ResponseEntity<BaseResponse<?>> updateRoomSettings(@PathVariable("roomId") Long roomId, @RequestBody UpdateRoomSettingsRequest request){
        Map<String, Object> response = roomService.updateRoomSettings(roomId, request);
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

    @PostMapping("/{roomId}/complete")
    public ResponseEntity<BaseResponse<?>> completeRoom(@PathVariable(name="roomId", required=true) Long roomId, @RequestBody RoomCompleteRequest roomCompleteRequest){
        Map<String, Object> response = roomService.completeRoom(roomId, roomCompleteRequest);
        System.out.println("컨트롤러   "+ roomCompleteRequest.getRoundRecordList());
        for(RoundRecordSaveRequest request : roomCompleteRequest.getRoundRecordList()){
            System.out.println(request.getRoundNumber());
            System.out.println(request.getDictionaryName());
            System.out.println(request.getExerciseCount());

        }

        return baseResponseService.getSuccessResponse(BaseSuccessResponse.COMPLETE_ROOM_SUCCESS, response);
    }

    @PostMapping("/monster")
    public ResponseEntity<BaseResponse<?>> getCapturedMonster(@RequestBody MonsterCaptureRequest request){
        Map<String, Object> response = roomService.getCapturedMonster(request);
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.GET_CAPTURED_MONSTER_SUCCESS, response);
    }

    @GetMapping("{roomId}")
    public ResponseEntity<BaseResponse<?>> getRoomInfo(@PathVariable("roomId") Long roomId){
        Map<String, Object> response = roomService.getRoomInfo(roomId);
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.GET_ROOM_INFORMATION_SUCCESS, response);
    }

}
