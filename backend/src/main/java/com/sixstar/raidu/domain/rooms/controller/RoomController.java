package com.sixstar.raidu.domain.rooms.controller;

import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.domain.rooms.dto.RoomCreateResponse;
import com.sixstar.raidu.domain.rooms.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/raidu/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomCreateResponse> createRoom(@RequestBody RoomCreateRequest request){
        RoomCreateResponse response = roomService.createRoom(request);
        return ResponseEntity.ok(response);
    }
}
