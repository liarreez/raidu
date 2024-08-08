package com.sixstar.raidu.domain.users.repository;

import com.sixstar.raidu.domain.users.entity.EmailCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmailCodeRepository extends JpaRepository<EmailCode, Long> {
  @Query("SELECT e.code FROM EmailCode e WHERE e.email = :email")
  String findCodeByEmail(@Param("email") String email);
}
