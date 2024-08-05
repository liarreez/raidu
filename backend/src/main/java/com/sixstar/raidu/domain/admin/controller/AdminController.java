package com.sixstar.raidu.domain.admin.controller;

import com.sixstar.raidu.domain.admin.dto.SeasonRequest;
import com.sixstar.raidu.domain.admin.service.AdminService;
import com.sixstar.raidu.domain.rooms.dto.RoomCreateRequest;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/raidu/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final BaseResponseService baseResponseService;

    @PostMapping("/seasons")
    public ResponseEntity<BaseResponse<?>> createSeason(@RequestBody SeasonRequest request){
        Map<String, Object> response = adminService.createSeason(request);
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.SEASON_CREATED_SUCCESS, response);
    }

}
