package com.sixstar.raidu.domain.dictionary.repository;

import com.sixstar.raidu.domain.dictionary.entity.Dictionary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DictionaryRepository extends JpaRepository<Dictionary, Long> {
    Dictionary findByName(String name);
}
