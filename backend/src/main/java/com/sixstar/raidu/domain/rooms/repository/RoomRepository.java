package com.sixstar.raidu.domain.rooms.repository;

import com.sixstar.raidu.domain.rooms.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatus(String status);
}
