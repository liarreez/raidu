package com.sixstar.raidu.domain.users.repository;

import com.sixstar.raidu.domain.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
