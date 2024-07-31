package com.sixstar.raidu.domain.main.repository;

import com.sixstar.raidu.domain.main.entity.Region;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegionRepository extends JpaRepository<Region, Long> {

  Optional<Region> findByName(String region);
}
