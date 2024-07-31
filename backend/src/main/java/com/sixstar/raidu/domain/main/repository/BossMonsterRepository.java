package com.sixstar.raidu.domain.main.repository;

import com.sixstar.raidu.domain.main.entity.BossMonster;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BossMonsterRepository extends JpaRepository<BossMonster, Long> {

  Optional<BossMonster> findBySeasonIdAndIsMainbossTrue(Long seasonId);
}
