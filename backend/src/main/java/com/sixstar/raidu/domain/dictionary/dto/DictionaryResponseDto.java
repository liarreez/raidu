package com.sixstar.raidu.domain.dictionary.dto;

import com.sixstar.raidu.domain.dictionary.entity.Dictionary;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DictionaryResponseDto {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String videoUrl;

    @Builder
    public DictionaryResponseDto(Long id, String name, String description, String imageUrl, String videoUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
    }

    public static DictionaryResponseDto fromEntity(Dictionary dictionary) {
        return DictionaryResponseDto.builder()
                .id(dictionary.getId())
                .name(dictionary.getName())
                .description(dictionary.getDescription())
                .imageUrl(dictionary.getImageUrl())
                .videoUrl(dictionary.getVideoUrl())
                .build();
    }
}
