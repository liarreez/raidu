package com.sixstar.raidu.domain.dictionary.service;

import com.sixstar.raidu.domain.dictionary.dto.DictionaryResponseDto;
import com.sixstar.raidu.domain.dictionary.entity.Dictionary;
import com.sixstar.raidu.domain.dictionary.repository.DictionaryRepository;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DictionaryServiceImpl implements DictionaryService{

    private final DictionaryRepository dictionaryRepository;

    @Override
    public Map<String, Object> searchDictionaries() {
        List<Dictionary> dictionaries = dictionaryRepository.findAll();
        Map<String, Object> data = new HashMap<>();
        data.put("dictionaries", dictionaries.stream()
                .map(DictionaryResponseDto::fromEntity)
                .collect(Collectors.toList()));
        return data;
    }

    @Override
    public Map<String, Object> searchDictionaryById(long id) {
        Dictionary dictionary = dictionaryRepository.findById(id)
                .orElseThrow(() -> new BaseException(BaseFailureResponse.DICTIONARY_NOT_FOUND));
        Map<String, Object> data = new HashMap<>();
        data.put("dictionary", DictionaryResponseDto.fromEntity(dictionary));
        return data;
    }
}
