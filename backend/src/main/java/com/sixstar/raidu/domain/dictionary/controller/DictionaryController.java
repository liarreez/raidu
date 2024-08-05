package com.sixstar.raidu.domain.dictionary.controller;

import com.sixstar.raidu.domain.dictionary.service.DictionaryService;
import com.sixstar.raidu.global.response.BaseResponse;
import com.sixstar.raidu.global.response.BaseResponseService;
import com.sixstar.raidu.global.response.BaseSuccessResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/raidu/dictionary")
@RequiredArgsConstructor
public class DictionaryController {
    private final DictionaryService dictionaryService;
    private final BaseResponseService baseResponseService;

    @GetMapping("")
    public ResponseEntity<BaseResponse<?>> searchDictionaries() {
        Map<String, Object> data = dictionaryService.searchDictionaries();
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.DICTIONARY_SEARCH_SUCCESS, data);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<?>> searchDictionaryByExerciseId(@PathVariable("id") long id) {
        Map<String, Object> data = dictionaryService.searchDictionaryById(id);
        return baseResponseService.getSuccessResponse(BaseSuccessResponse.DICTIONARY_SEARCH_SUCCESS, data);
    }
}
