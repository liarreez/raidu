package com.sixstar.raidu.domain.admin.controller;

import com.sixstar.raidu.domain.admin.dto.SeasonRequest;
import com.sixstar.raidu.global.response.BaseResponse;
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

//    @PostMapping("/{seasons}")
//    public ResponseEntity<BaseResponse<?>> createSeason(@RequestBody SeasonRequest request){
//        return
//    }
}
