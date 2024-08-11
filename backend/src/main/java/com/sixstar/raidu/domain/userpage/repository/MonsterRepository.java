package com.sixstar.raidu.domain.userpage.repository;

import com.sixstar.raidu.domain.userpage.entity.Monster;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonsterRepository extends JpaRepository<Monster, Long> {
    List<Monster> findByStageLessThanEqual(int stage);

}
