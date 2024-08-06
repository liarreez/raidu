package com.sixstar.raidu.domain.userpage.repository.specification;

import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import org.springframework.data.jpa.domain.Specification;

public class UserProfileSpecification {
    public static Specification<UserProfile> findByNickname(String nickname){
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("nickname"), "%"+nickname+"%");
    }

}
