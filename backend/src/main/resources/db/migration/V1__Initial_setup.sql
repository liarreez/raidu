CREATE TABLE `User` (
                        `uuid` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                        `email` VARCHAR(50) UNIQUE NOT NULL,
                        `password` VARCHAR(50) NULL,
                        `is_active` TINYINT NOT NULL DEFAULT TRUE,
                        `role` VARCHAR(50) NOT NULL DEFAULT 'user',
                        `social_type` VARCHAR(50) NULL,
                        `social_id` VARCHAR(50) NULL,
                        `refresh_token` VARCHAR(255) NULL,
                        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `Region` (
                          `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                          `name` VARCHAR(50) UNIQUE NOT NULL,
                          `symbol_image_url` VARCHAR(255) NULL,
                          `description` VARCHAR(255) NULL,
                          `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `UserProfile` (
                               `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                               `uuid` BIGINT NOT NULL,
                               `email` VARCHAR(50) UNIQUE NOT NULL,
                               `nickname` VARCHAR(50) UNIQUE NOT NULL,
                               `region_id` BIGINT NOT NULL,
                               `level` INT NOT NULL DEFAULT 1,
                               `exp` INT NOT NULL DEFAULT 0,
                               `best_score` INT NOT NULL DEFAULT 0,
                               `best_score_updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               `profile_image_url` VARCHAR(255) NULL,
                               `backgroud_image_url` VARCHAR(255) NULL,
                               `monster_badge_url` VARCHAR(255) NULL,
                               `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               FOREIGN KEY (`uuid`) REFERENCES `User`(`uuid`),
                               FOREIGN KEY (`region_id`) REFERENCES `Region`(`id`)
);

CREATE TABLE `Season` (
                          `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                          `name` VARCHAR(50) UNIQUE NOT NULL,
                          `start_date` TIMESTAMP NOT NULL,
                          `end_date` TIMESTAMP NOT NULL
);

CREATE TABLE `SeasonRegionScore` (
                                     `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                                     `season_id` BIGINT NOT NULL,
                                     `region_id` BIGINT NOT NULL,
                                     `score` BIGINT NOT NULL DEFAULT 0,
                                     FOREIGN KEY (`season_id`) REFERENCES `Season`(`id`),
                                     FOREIGN KEY (`region_id`) REFERENCES `Region`(`id`)
);

CREATE TABLE `Dictionary` (
                              `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                              `name` VARCHAR(50) UNIQUE NOT NULL,
                              `description` VARCHAR(50) NULL,
                              `image_url` VARCHAR(255) NULL,
                              `video_url` VARCHAR(255) NULL,
                              `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              `is_playable` TINYINT NOT NULL DEFAULT 0
);

CREATE TABLE `Room` (
                        `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                        `title` VARCHAR(50) NOT NULL,
                        `max_participants` INT NOT NULL,
                        `is_public` TINYINT NOT NULL DEFAULT TRUE,
                        `round_time` INT NOT NULL,
                        `rest_time` INT NOT NULL,
                        `total_rounds` INT NOT NULL,
                        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        `status` VARCHAR(50) NOT NULL DEFAULT 'waiting',
                        `host_id` BIGINT NOT NULL,
                        FOREIGN KEY (`host_id`) REFERENCES `UserProfile`(`id`)
);

CREATE TABLE `RoomUser` (
                            `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                            `room_id` BIGINT NOT NULL,
                            `user_id` BIGINT NOT NULL,
                            FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`),
                            FOREIGN KEY (`user_id`) REFERENCES `UserProfile`(`id`)
);

CREATE TABLE `ExerciseRoomRecord` (
                                      `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                                      `user_id` BIGINT NOT NULL,
                                      `room_id` BIGINT NOT NULL,
                                      `end_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      `personal_combat_power` INT NOT NULL,
                                      `total_combat_power` INT NOT NULL,
                                      `participants_count` INT NOT NULL,
                                      `stage` INT NOT NULL,
                                      FOREIGN KEY (`user_id`) REFERENCES `UserProfile`(`id`),
                                      FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`)
);

CREATE TABLE `RoundRecord` (
                               `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                               `exercise_room_record_id` BIGINT NOT NULL,
                               `round_number` INT NOT NULL,
                               `dictionary_id` BIGINT NOT NULL,
                               `exercise_count` INT NOT NULL,
                               FOREIGN KEY (`exercise_room_record_id`) REFERENCES `ExerciseRoomRecord`(`id`),
                               FOREIGN KEY (`dictionary_id`) REFERENCES `Dictionary`(`id`)
);

CREATE TABLE `Monster` (
                           `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                           `name` VARCHAR(50) UNIQUE NOT NULL,
                           `stage` INT NOT NULL,
                           `image_url` VARCHAR(255) NULL,
                           `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `UserMonster` (
                               `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                               `user_id` BIGINT NOT NULL,
                               `monster_id` BIGINT NOT NULL,
                               `captured_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               FOREIGN KEY (`user_id`) REFERENCES `UserProfile`(`id`),
                               FOREIGN KEY (`monster_id`) REFERENCES `Monster`(`id`)
);

CREATE TABLE `Report` (
                          `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                          `reporting_user_id` BIGINT NOT NULL,
                          `reported_user_id` BIGINT NOT NULL,
                          `report_reason` VARCHAR(50) NOT NULL,
                          `report_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (`reporting_user_id`) REFERENCES `UserProfile`(`id`),
                          FOREIGN KEY (`reported_user_id`) REFERENCES `UserProfile`(`id`)
);

CREATE TABLE `SeasonUserScore` (
                                   `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                                   `season_id` BIGINT NOT NULL,
                                   `user_id` BIGINT NOT NULL,
                                   `score` INT NOT NULL DEFAULT 0,
                                   FOREIGN KEY (`season_id`) REFERENCES `Season`(`id`),
                                   FOREIGN KEY (`user_id`) REFERENCES `UserProfile`(`id`)
);

CREATE TABLE `BossMonster` (
                               `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                               `season_id` BIGINT NULL,
                               `name` VARCHAR(50) UNIQUE NOT NULL,
                               `image_url` VARCHAR(255) NULL,
                               `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               `hp` BIGINT NOT NULL,
                               FOREIGN KEY (`season_id`) REFERENCES `Season`(`id`)
);

CREATE TABLE `UserBossMonster` (
                                   `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                                   `boss_monster_id` BIGINT NOT NULL,
                                   `user_profile_id` BIGINT NOT NULL,
                                   `captured_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   FOREIGN KEY (`boss_monster_id`) REFERENCES `BossMonster`(`id`),
                                   FOREIGN KEY (`user_profile_id`) REFERENCES `UserProfile`(`id`)
);
