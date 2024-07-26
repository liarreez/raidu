CREATE TABLE `User` (
                        `uuid`	BIGINT AUTO_INCREMENT	NOT NULL,
                        `email`	VARCHAR(50) UNIQUE	NOT NULL,
                        `password`	VARCHAR(50)	NULL,
                        `is_active`	TINYINT	NOT NULL	DEFAULT TRUE,
                        `role`	VARCHAR(50)	NOT NULL	DEFAULT "user",
                        `social_type`	VARCHAR(50)	NULL,
                        `social_id`	VARCHAR(50)	NULL,
                        `refresh_token`	VARCHAR(255)	NULL,
                        `created_at`	TIMESTAMP	NOT NULL	DEFAULT NOW(),
                        `updated_at`	TIMESTAMP	NOT NULL	DEFAULT NOW()
);

CREATE TABLE `UserProfile` (
                               `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                               `uuid`	BIGINT AUTO_INCREMENT	NOT NULL,
                               `email`	VARCHAR(50) UNIQUE	NOT NULL,
                               `nickname`	VARCHAR(50) UNIQUE	NOT NULL,
                               `region_id`	BIGINT AUTO_INCREMENT	NOT NULL,
                               `level`	INT	NOT NULL	DEFAULT 1,
                               `exp`	INT	NOT NULL	DEFAULT 0,
                               `best_score`	INT	NOT NULL	DEFAULT 0,
                               `best_score_updated_at`	TIMESTAMP	NOT NULL	DEFAULT NOW(),
                               `profile_image_url`	VARCHAR(255)	NULL,
                               `backgroud_image_url`	VARCHAR(255)	NULL,
                               `monster_badge_url`	VARCHAR(255)	NULL,
                               `updated_at`	TIMESTAMP	NOT NULL	DEFAULT NOW()
);

CREATE TABLE `Region` (
                          `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                          `name`	VARCHAR(50) UNIQUE	NOT NULL,
                          `symbol_image_url`	VARCHAR(255)	NULL,
                          `description`	VARCHAR(255)	NULL,
                          `updated_at`	TIMESTAMP	NOT NULL	DEFAULT NOW()
);

CREATE TABLE `Season` (
                          `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                          `name`	VARCHAR(50) UNIQUE	NOT NULL,
                          `start_date`	TIMESTAMP	NOT NULL,
                          `end_date`	TIMESTAMP	NOT NULL
);

CREATE TABLE `SeasonRegionScore` (
                                     `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                                     `season_id`	BIGINT AUTO_INCREMENT	NOT NULL,
                                     `region_id`	BIGINT AUTO_INCREMENT	NOT NULL,
                                     `score`	BIGINT	NOT NULL	DEFAULT 0
);

CREATE TABLE `Room` (
                        `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                        `title`	VARCHAR(50)	NOT NULL,
                        `max_participants`	INT	NOT NULL,
                        `is_public`	TINYINT	NOT NULL	DEFAULT TRUE,
                        `round_time`	INT	NOT NULL,
                        `rest_time`	INT	NOT NULL,
                        `total_rounds`	INT	NOT NULL,
                        `created_at`	TIMESTAMP	NOT NULL	DEFAULT NOW(),
                        `updated_at`	TIMESTAMP	NOT NULL	DEFAULT NOW(),
                        `status`	VARCHAR(50)	NOT NULL	DEFAULT "waiting",
                        `host_id`	BIGINT AUTO_INCREMENT	NOT NULL
);

CREATE TABLE `RoomUser` (
                            `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                            `room_id`	BIGINT AUTO_INCREMENT	NOT NULL,
                            `user_id`	BIGINT AUTO_INCREMENT	NOT NULL
);

CREATE TABLE `ExerciseRoomRecord` (
                                      `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                                      `user_id`	BIGINT AUTO_INCREMENT	NOT NULL,
                                      `room_id`	BIGINT AUTO_INCREMENT	NOT NULL,
                                      `end_time`	TIMESTAMP	NOT NULL	DEFAULT NOW(),
                                      `personal_combat_power`	INT	NOT NULL,
                                      `total_combat_power`	INT	NOT NULL,
                                      `participants_count`	INT	NOT NULL,
                                      `stage`	INT	NOT NULL
);

CREATE TABLE `RoundRecord` (
                               `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                               `exercise_room_record_id`	BIGINT AUTO_INCREMENT	NOT NULL,
                               `round_number`	INT	NOT NULL,
                               `dictionary_id`	BIGINT AUTO_INCREMENT	NOT NULL,
                               `exercise_count`	INT	NOT NULL
);

CREATE TABLE `Dictionary` (
                              `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                              `name`	VARCHAR(50) UNIQUE	NOT NULL,
                              `description`	VARCHAR(50)	NULL,
                              `image_url`	VARCHAR(255)	NULL,
                              `video_url`	VARCHAR(255)	NULL,
                              `created_at`	TIMESTAMP	NOT NULL	DEFAULT NOW(),
                              `updated_at`	TIMESTAMP	NOT NULL	DEFAULT NOW(),
                              `is_playable`	TINYINT	NOT NULL	DEFAULT 0
);

CREATE TABLE `Monster` (
                           `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                           `name`	VARCHAR(50) UNIQUE	NOT NULL,
                           `stage`	INT	NOT NULL,
                           `image_url`	VARCHAR(255)	NULL,
                           `created_at`	TIMESTAMP	NOT NULL	DEFAULT NOW(),
                           `updated_at`	TIMESTAMP	NOT NULL	DEFAULT NOW()
);

CREATE TABLE `UserMonster` (
                               `id`	BIGINT AUTO_INCREMENT	NOT NULL,
                               `user_id`	BIGINT AUTO_INCREMENT	NOT NULL,
                               `monster_id`	BIGINT AUTO_INCREMENT	NOT NULL,
                               `captured_at`	TIMESTAMP	NOT NULL	DEFAULT NOW()
);

CREATE TABLE `Report` (
    `id`	BIGINT AUTO_INCREMENT	NOT NULL,
	`reporting_user_id`	BIGINT AUTO_INCREMENT	NOT NULL,
	`reported_user_id`	BIGINT AUTO_INCREMENT	NOT NULL,
	`report_reason`	VARCHAR(50)	NOT NULL,
	`report_date`	TIMESTAMP	NOT NULL	DEFAULT NOW()
);

CREATE TABLE `SeasonUserScore` (
	`id`	VARCHAR(255)	NOT NULL,
	`season_id`	BIGINT AUTO_INCREMENT	NOT NULL,
	`user_id`	BIGINT AUTO_INCREMENT	NOT NULL,
	`score`	INT	NOT NULL	DEFAULT 0
);

CREATE TABLE `BossMonster` (
	`id`	BIGINT AUTO_INCREMENT	NOT NULL,
	`season_id`	BIGINT AUTO_INCREMENT	NULL,
	`name`	VARCHAR(50) UNIQUE	NOT NULL,
	`image_url`	VARCHAR(255)	NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT NOW(),
	`updated_at`	TIMESTAMP	NOT NULL	DEFAULT NOW(),
	`hp`	BIGINT	NOT NULL
);

CREATE TABLE `UserBossMonster` (
	`id`	BIGINT AUTO_INCREMENT	NOT NULL,
	`boss_monster_id`	BIGINT AUTO_INCREMENT	NOT NULL,
	`user_profile_id`	BIGINT AUTO_INCREMENT	NOT NULL,
	`captured_at`	TIMESTAMP	NOT NULL	DEFAULT NOW()
);

ALTER TABLE `User` ADD CONSTRAINT `PK_USER` PRIMARY KEY (
	`uuid`
);

ALTER TABLE `UserProfile` ADD CONSTRAINT `PK_USERPROFILE` PRIMARY KEY (
	`id`
);

ALTER TABLE `Region` ADD CONSTRAINT `PK_REGION` PRIMARY KEY (
	`id`
);

ALTER TABLE `Season` ADD CONSTRAINT `PK_SEASON` PRIMARY KEY (
	`id`
);

ALTER TABLE `SeasonRegionScore` ADD CONSTRAINT `PK_SEASONREGIONSCORE` PRIMARY KEY (
	`id`
);

ALTER TABLE `Room` ADD CONSTRAINT `PK_ROOM` PRIMARY KEY (
	`id`
);

ALTER TABLE `RoomUser` ADD CONSTRAINT `PK_ROOMUSER` PRIMARY KEY (
	`id`
);

ALTER TABLE `ExerciseRoomRecord` ADD CONSTRAINT `PK_EXERCISEROOMRECORD` PRIMARY KEY (
	`id`
);

ALTER TABLE `RoundRecord` ADD CONSTRAINT `PK_ROUNDRECORD` PRIMARY KEY (
	`id`
);

ALTER TABLE `Dictionary` ADD CONSTRAINT `PK_DICTIONARY` PRIMARY KEY (
	`id`
);

ALTER TABLE `Monster` ADD CONSTRAINT `PK_MONSTER` PRIMARY KEY (
	`id`
);

ALTER TABLE `UserMonster` ADD CONSTRAINT `PK_USERMONSTER` PRIMARY KEY (
	`id`
);

ALTER TABLE `Report` ADD CONSTRAINT `PK_REPORT` PRIMARY KEY (
	`id`
);

ALTER TABLE `SeasonUserScore` ADD CONSTRAINT `PK_SEASONUSERSCORE` PRIMARY KEY (
	`id`
);

ALTER TABLE `BossMonster` ADD CONSTRAINT `PK_BOSSMONSTER` PRIMARY KEY (
	`id`
);

ALTER TABLE `UserBossMonster` ADD CONSTRAINT `PK_USERBOSSMONSTER` PRIMARY KEY (
	`id`
);

ALTER TABLE `UserProfile` ADD CONSTRAINT `FK_User_TO_UserProfile_1` FOREIGN KEY (
	`uuid`
)
REFERENCES `User` (
	`uuid`
);

ALTER TABLE `UserProfile` ADD CONSTRAINT `FK_Region_TO_UserProfile_1` FOREIGN KEY (
	`region_id`
)
REFERENCES `Region` (
	`id`
);

ALTER TABLE `SeasonRegionScore` ADD CONSTRAINT `FK_Season_TO_SeasonRegionScore_1` FOREIGN KEY (
	`season_id`
)
REFERENCES `Season` (
	`id`
);

ALTER TABLE `SeasonRegionScore` ADD CONSTRAINT `FK_Region_TO_SeasonRegionScore_1` FOREIGN KEY (
	`region_id`
)
REFERENCES `Region` (
	`id`
);

ALTER TABLE `Room` ADD CONSTRAINT `FK_UserProfile_TO_Room_1` FOREIGN KEY (
	`host_id`
)
REFERENCES `UserProfile` (
	`id`
);

ALTER TABLE `RoomUser` ADD CONSTRAINT `FK_Room_TO_RoomUser_1` FOREIGN KEY (
	`room_id`
)
REFERENCES `Room` (
	`id`
);

ALTER TABLE `RoomUser` ADD CONSTRAINT `FK_UserProfile_TO_RoomUser_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `UserProfile` (
	`id`
);

ALTER TABLE `ExerciseRoomRecord` ADD CONSTRAINT `FK_UserProfile_TO_ExerciseRoomRecord_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `UserProfile` (
	`id`
);

ALTER TABLE `ExerciseRoomRecord` ADD CONSTRAINT `FK_Room_TO_ExerciseRoomRecord_1` FOREIGN KEY (
	`room_id`
)
REFERENCES `Room` (
	`id`
);

ALTER TABLE `RoundRecord` ADD CONSTRAINT `FK_ExerciseRoomRecord_TO_RoundRecord_1` FOREIGN KEY (
	`exercise_room_record_id`
)
REFERENCES `ExerciseRoomRecord` (
	`id`
);

ALTER TABLE `RoundRecord` ADD CONSTRAINT `FK_Dictionary_TO_RoundRecord_1` FOREIGN KEY (
	`dictionary_id`
)
REFERENCES `Dictionary` (
	`id`
);

ALTER TABLE `UserMonster` ADD CONSTRAINT `FK_UserProfile_TO_UserMonster_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `UserProfile` (
	`id`
);

ALTER TABLE `UserMonster` ADD CONSTRAINT `FK_Monster_TO_UserMonster_1` FOREIGN KEY (
	`monster_id`
)
REFERENCES `Monster` (
	`id`
);

ALTER TABLE `Report` ADD CONSTRAINT `FK_UserProfile_TO_Report_1` FOREIGN KEY (
	`reporting_user_id`
)
REFERENCES `UserProfile` (
	`id`
);

ALTER TABLE `Report` ADD CONSTRAINT `FK_UserProfile_TO_Report_2` FOREIGN KEY (
	`reported_user_id`
)
REFERENCES `UserProfile` (
	`id`
);

ALTER TABLE `SeasonUserScore` ADD CONSTRAINT `FK_Season_TO_SeasonUserScore_1` FOREIGN KEY (
	`season_id`
)
REFERENCES `Season` (
	`id`
);

ALTER TABLE `SeasonUserScore` ADD CONSTRAINT `FK_UserProfile_TO_SeasonUserScore_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `UserProfile` (
	`id`
);

ALTER TABLE `BossMonster` ADD CONSTRAINT `FK_Season_TO_BossMonster_1` FOREIGN KEY (
	`season_id`
)
REFERENCES `Season` (
	`id`
);

ALTER TABLE `UserBossMonster` ADD CONSTRAINT `FK_BossMonster_TO_UserBossMonster_1` FOREIGN KEY (
	`boss_monster_id`
)
REFERENCES `BossMonster` (
	`id`
);

ALTER TABLE `UserBossMonster` ADD CONSTRAINT `FK_UserProfile_TO_UserBossMonster_1` FOREIGN KEY (
	`user_profile_id`
)
REFERENCES `UserProfile` (
	`id`
);