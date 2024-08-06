package com.sixstar.raidu.domain.rooms.repository.specification;

import com.sixstar.raidu.domain.rooms.entity.Room;
import org.springframework.data.jpa.domain.Specification;

public class RoomSpecification {

    public static Specification<Room> baseWaitingRoomSpec() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
            criteriaBuilder.equal(root.get("status"), "waiting"),
            criteriaBuilder.isTrue(root.get("isPublic"))
        );
    }

    public static Specification<Room> findByRoundTime(int roundTime){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("roundTime"), roundTime);
    }

    public static Specification<Room> findByRestTime(int restTime){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("restTime"), restTime);
    }

    public static Specification<Room> findByTotalRounds(int totalRounds){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("totalRounds"), totalRounds);
    }

    public static Specification<Room> likeTitle(String title){
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("title"), "%"+title+"%");
    }

}
