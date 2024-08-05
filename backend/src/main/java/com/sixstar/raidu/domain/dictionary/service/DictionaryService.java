package com.sixstar.raidu.domain.dictionary.service;

import java.util.Map;

public interface DictionaryService {
    Map<String, Object> searchDictionaries();

    Map<String, Object> searchDictionaryById(long id);
}
