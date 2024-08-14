DROP DATABASE raidu;
CREATE DATABASE IF NOT EXISTS raidu;

use raidu;

-- V1
CREATE TABLE `User` (
                        `uuid` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                        `email` VARCHAR(50) UNIQUE NOT NULL,
                        `password` VARCHAR(255) NULL,
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
                               `background_image_url` VARCHAR(255) NULL,
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

-- V2
-- Define a procedure to rename a table if it exists and if the target name does not exist
DROP PROCEDURE IF EXISTS rename_if_not_exists;
DELIMITER $$
CREATE PROCEDURE rename_if_not_exists(IN old_name VARCHAR(64), IN new_name VARCHAR(64))
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN END;

    -- Check if the old table exists and the new table does not exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = old_name)
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = new_name) THEN
        SET @stmt = CONCAT('RENAME TABLE ', old_name, ' TO ', new_name);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
END IF;
END$$
DELIMITER ;

-- Call the procedure for each table
CALL rename_if_not_exists('User', 'user');
CALL rename_if_not_exists('Region', 'region');
CALL rename_if_not_exists('UserProfile', 'user_profile');
CALL rename_if_not_exists('Season', 'season');
CALL rename_if_not_exists('SeasonRegionScore', 'season_region_score');
CALL rename_if_not_exists('Dictionary', 'dictionary');
CALL rename_if_not_exists('Room', 'room');
CALL rename_if_not_exists('RoomUser', 'room_user');
CALL rename_if_not_exists('ExerciseRoomRecord', 'exercise_room_record');
CALL rename_if_not_exists('RoundRecord', 'round_record');
CALL rename_if_not_exists('Monster', 'monster');
CALL rename_if_not_exists('UserMonster', 'user_monster');
CALL rename_if_not_exists('Report', 'report');
CALL rename_if_not_exists('SeasonUserScore', 'season_user_score');
CALL rename_if_not_exists('BossMonster', 'boss_monster');
CALL rename_if_not_exists('UserBossMonster', 'user_boss_monster');

-- Clean up
DROP PROCEDURE IF EXISTS rename_if_not_exists;

-- V3
-- V3__rename_remaining_tables_to_lowercase.sql

-- Define a procedure to rename a table if it exists and if the target name does not exist
DROP PROCEDURE IF EXISTS rename_if_not_exists;
DELIMITER $$
CREATE PROCEDURE rename_if_not_exists(IN old_name VARCHAR(64), IN new_name VARCHAR(64))
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN END;

    -- Check if the old table exists and the new table does not exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'raidu' AND table_name = old_name)
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'raidu' AND table_name = new_name) THEN
        SET @stmt = CONCAT('RENAME TABLE ', old_name, ' TO ', new_name);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
END IF;
END$$
DELIMITER ;

-- Call the procedure for Monster and Report tables
CALL rename_if_not_exists('Monster', 'monster');
CALL rename_if_not_exists('Report', 'report');

-- Clean up
DROP PROCEDURE IF EXISTS rename_if_not_exists;

-- V4
-- V4__rename_6tables.sql

-- Try renaming 'Dictionary' table, ignore if it fails
ALTER TABLE `Dictionary` RENAME TO `dictionary`;
-- Try renaming 'Monster' table, ignore if it fails
ALTER TABLE `Monster` RENAME TO `monster`;
-- Try renaming 'Region' table, ignore if it fails
ALTER TABLE `Region` RENAME TO `region`;
-- Try renaming 'Report' table, ignore if it fails
ALTER TABLE `Report` RENAME TO `report`;
-- Try renaming 'Room' table, ignore if it fails
ALTER TABLE `Room` RENAME TO `room`;
-- Try renaming 'Season' table, ignore if it fails
ALTER TABLE `Season` RENAME TO `season`;
-- Try renaming 'User' table, ignore if it fails
ALTER TABLE `User` RENAME TO `user`;

-- V5
ALTER TABLE monster
    ADD COLUMN description VARCHAR(255);

ALTER TABLE boss_monster
    ADD COLUMN description VARCHAR(255);

ALTER TABLE boss_monster
    ADD COLUMN is_mainboss BOOLEAN DEFAULT FALSE;

-- V6
ALTER TABLE user
    ADD COLUMN is_reported TINYINT;



-- user 데이터
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("admin@raidu.com", "$2a$10$672.oMRK1AG4A0EDxrB.6uF9RyysfuGENjUljP9Z9CR09I7W4z91S", true, false, "ROLE_ADMIN");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("test@raidu.com", "$2a$10$7cnx5w3hpoQWZr9OHDS5wuOWNXRVTNRcmkcF6pA8vwUGFlaPL3jqO", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("park@raidu.com", "$2a$10$8v0UNvicZd7ZpbcLNIJc/enWAm1DO2.7d8q2oxnPEr7jtJAoJLVeS", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("chae@raidu.com", "$2a$10$MUwtfhrstq8DfZ6xYAfm4.GaQFt.pffFOI390GH0j3bpXiO5UHI4O", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("lee@raidu.com", "$2a$10$/heo1k8P64DpBCU6rYWlEOA7EUVds9zIzHG0g/5yYybvqChkyeL.i", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("jo@raidu.com", "$2a$10$ce4g.dj57poLip7E.3IHK.deMWpQLKRtCCbbv.pBmPHguZekNw4MC", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("yoon@raidu.com", "$2a$10$TAFlPspsJoCGJw4a/um61.o6IAWaSrkBHDT5j/PCEvIRg8qsA.HoW", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("yang@raidu.com", "$2a$10$AGNDdUpawgS388B7P/uhEuE00T9MCHou22u04XlAKl8A28TLPoqgK", true, false, "ROLE_USER");
-- 이후 추가된 데이터
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("kim@raidu.com", "$2a$10$Jbng7Rf8wKnk6ALVGnPspOaEvJHK/LO/5k5g4A.oOhlbEyFvv.M2.", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("hwang@raidu.com", "$2a$10$hAK7ZPAK6l4V9nksf7oPUuSApBfFf0Eoe.Ghtj4aCmRt/9ugm13z.", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("choi@raidu.com", "$2a$10$7rDxFojh2DxFN/nbmFUsVe7AAnrzBcUk5ElGujBrrEqG2vK1qFx16", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("jung@raidu.com", "$2a$10$zBOvC2pGVRx4yQF7F0f1AOgPhX9WmXJ2UvZQyob.AY7DoisFuoMUm", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("kang@raidu.com", "$2a$10$ZwEi1J.hxTj2mnYBpqIoe.uKP7g8xH9lBlC7P9cfKx5P10ZGVvxs6", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("lim@raidu.com", "$2a$10$3WftXNEK3qHupG5NpvViMeMSM3.ZNrmBPOc3G1H1JUE9vsyjLaAiG", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("hong@raidu.com", "$2a$10$a2PHy3k8r7oFS5Snjv5K9OHP7zNmuWb.A7PiyURzB13m1F7ddV2ve", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("shin@raidu.com", "$2a$10$aC4Lg1XOsRQIXbCkA9iNwO5YYfiPKJ7Z9CStxP6.jaUJw9OeN.Ze6", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("kim2@raidu.com", "$2a$10$e9HREm5O2M5nGj.TnG3kpem.yXh7POV9ujV99A.1jJfKQUo3USsMK", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("lee2@raidu.com", "$2a$10$ie2.XG/YzC.lDP4yG7.xCuE96/RGyXVwNp/H.C2Is7L1YHgXtRnaK", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("park2@raidu.com", "$2a$10$7hRZc3zsoYN.Aq7uDE/TGeFCgTnL4xCBEDSCtZ9Dp2YJp4r3L1eL6", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("jang@raidu.com", "$2a$10$TeIqweq1/5cYZr1hyEPc4upPY4c3JHJ1y7BHvYZqOqlcm9CskXYae", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("oh@raidu.com", "$2a$10$DKr8h/3RIq57KP6U27QME.e2cWzLbohnYJfY.l0Lq9AX3IThV65Tu", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("kwon@raidu.com", "$2a$10$Uql/M9zBdj7kd5lVdBCkGegqRKKPB0OrP9Z7SR3I58yYAKWRGEm1e", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("bae@raidu.com", "$2a$10$d1eSx4EhNu7k0lXIQWZnWONsghzGiDxzRuhbFzmL/WnP6bPbLOJau", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("an@raidu.com", "$2a$10$Efd4uEG6Ph3ri1R6j0AVH.k/ikzyoGhP4u5uUMmgdJnZ4GqeXUE1K", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("seo@raidu.com", "$2a$10$yI9lH6R8ThF0rT8e9fReQuCl0j0G4Ezz0AhkTr3.D7GhOw30eRZiW", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("jung2@raidu.com", "$2a$10$bwVh5STy.Fn.4hNxyx3DpeQdXyEf3GV1PTaIl9.f3SkzvNLzOlc/a", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("lee3@raidu.com", "$2a$10$TeJWhmRL6nL5YrOhfhMKuOnWug.w2PjVKlDYe2LlZzBJKBLiF3oqK", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("yoon2@raidu.com", "$2a$10$uj2yS7bX4Lygyb/Nc.OQ4eFJ/f2X93xl7kVGWORcCE4ZoZ2rgv5Ii", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("test1@raidu.com", "$2a$10$pNkrPO/jO6kKrxEyjicRAOImEoHLacQ0kYZyU1LuYof.U5dgjiKiC", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("test2@raidu.com", "$2a$10$a.wHxfiUa4K.PlXUv5JXke2cVO7zliiGWjpg59W.50563UaTsYwWC", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("test3@raidu.com", "$2a$10$WfsNe/sJXmGNdrjE3YOC7u7/UauapllaLV.R1g1shMSSrYl/NRNDu", true, false, "ROLE_USER");
INSERT INTO user(email, password, is_active, is_reported, role)
VALUES("test4@raidu.com", "$2a$10$rd0F7/yMhfj8WUh7MV8qGOPJGfaRaH63Xq0/Ds2vD12RAmIu983te", true, false, "ROLE_USER");

-- region 데이터
INSERT INTO region(name, description) VALUES("근력의 절벽", "힘 중시 지역");
INSERT INTO region(name, description) VALUES("민첩의 숲", "민첩 중시 지역");
INSERT INTO region(name, description) VALUES("지구력의 사막", "지구력 중시 지역");
INSERT INTO region(name, description) VALUES("유연의 해변", "유연성 중시 지역");

-- season 데이터
INSERT INTO season(name, start_date, end_date) VALUES("레이두의 서막", "2024-07-01", "2024-07-31");
INSERT INTO season(name, start_date, end_date) VALUES("모험의 시작", "2024-08-01", "2024-08-31");
-- 추가된 데이터
INSERT INTO season(name, start_date, end_date) VALUES("수련의 시간", "2024-09-01", "2024-09-30");
INSERT INTO season(name, start_date, end_date) VALUES("인내의 시간", "2024-10-01", "2024-10-31");
INSERT INTO season(name, start_date, end_date) VALUES("성장의 결과를 보여줄때", "2024-11-01", "2024-11-30");
INSERT INTO season(name, start_date, end_date) VALUES("마왕성으로", "2024-12-01", "2024-12-31");
INSERT INTO season(name, start_date, end_date) VALUES("레이두의 종결", "2024-01-01", "2024-01-31");


-- userProfile 데이터
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (1, "admin@raidu.com", "관리자", 1, 99, 749, 100000000,20240701000000);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score)
VALUES (2, "test@raidu.com", "테스터", 1, 1, 0, 0);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score)
VALUES (3, "park@raidu.com", "박성혁", 2, 1, 0, 0);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score)
VALUES (4, "chae@raidu.com", "채이슬", 3, 1, 0, 0);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score)
VALUES (5, "lee@raidu.com", "이주영", 4, 1, 0, 0);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (6, "jo@raidu.com", "조승희", 1, 2, 300, 10 ,20240701095030);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (7, "yoon@raidu.com", "윤정환", 2, 3, 200, 20 ,20240703112513);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (8, "yang@raidu.com", "양지웅", 3, 15, 50, 10000 ,20240705172533);
-- 추가된 데이터
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (9, "kim@raidu.com", "김재훈", 1, 2, 50, 1500,20240707163520);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (10, "hwang@raidu.com", "황수민", 2, 3, 200, 3000 ,20240709231235);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (11, "choi@raidu.com", "최민수", 3, 4, 300, 4500 ,20240711222513);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (12, "jung@raidu.com", "정수정", 4, 5, 400, 6000, 20240713015213);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (13, "kang@raidu.com", "강하늘", 1, 6, 500, 7500, 20240715171513);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (14, "lim@raidu.com", "임지민", 2, 7, 600, 9000, 20240717161523);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (15, "hong@raidu.com", "홍진호", 3, 8, 700, 1050, 20240719202020);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (16, "shin@raidu.com", "신동엽", 4, 9, 800, 1200, 20240721232323);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (17, "kim2@raidu.com", "김영철", 1, 10, 900, 1350, 20240723112513);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (18, "lee2@raidu.com", "이정민", 2, 11, 1000, 1500, 20240725055032);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (19, "park2@raidu.com", "박은지", 3, 12, 1100, 1650, 20240727072513);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (20, "jang@raidu.com", "장동건", 4, 13, 1200, 1800, 20240729093013);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (21, "oh@raidu.com", "오지호", 1, 14, 1300, 1950, 20240731124013);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (22, "kwon@raidu.com", "권민수", 2, 15, 1400, 2100, 20240801020202);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (23, "bae@raidu.com", "배수빈", 3, 16, 1500, 2250, 20240803040404);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (24, "an@raidu.com", "안성기", 4, 17, 1600, 2400, 20240803040404);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (25, "seo@raidu.com", "서장훈", 1, 18, 1700, 2550, 20240805040404);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (26, "jung2@raidu.com", "정지훈", 2, 19, 1800, 2700, 20240807040404);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (27, "lee3@raidu.com", "이민호", 3, 20, 1900, 2850, 20240809062422);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score, best_score_updated_at)
VALUES (28, "yoon2@raidu.com", "윤계상", 4, 21, 2000, 3000, 20240811071414);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score)
VALUES (29, "test1@raidu.com", "테스터1", 1, 1, 0, 0);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score)
VALUES (30, "test2@raidu.com", "테스터2", 2, 1, 0, 0);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score)
VALUES (31, "test3@raidu.com", "테스터3", 3, 1, 0, 0);
INSERT INTO user_profile(uuid, email, nickname, region_id, level, exp, best_score)
VALUES (32, "test4@raidu.com", "테스터4", 4, 1, 0, 0);




--  report 데이터
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (3, 5, "그냥");
-- 추가된 데이터
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (3, 5, "비매너 플레이");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (6, 7, "부적절한 닉네임");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (8, 9, "팀킬");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (10, 11, "게임 방해");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (12, 13, "욕설");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (14, 15, "비정상적인 플레이");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (16, 17, "협박");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (18, 19, "사기 행위");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (20, 21, "무단 이탈");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (22, 23, "저작권 침해");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (24, 25, "명예훼손");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (26, 27, "스팸 메시지");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (28, 2, "허위 신고");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (3, 4, "폭력적인 행동");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (5, 6, "불법 프로그램 사용");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (7, 8, "개인정보 유출");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (9, 10, "불법 거래");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (11, 12, "비매너 플레이");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (13, 14, "욕설");
INSERT INTO report(reporting_user_id, reported_user_id, report_reason)
VALUES (15, 16, "게임 방해");

-- season_region_score 데이터
INSERT INTO season_region_score(season_id, region_id, score)
VALUES(1, 1, 30000);
INSERT INTO season_region_score(season_id, region_id, score)
VALUES(1, 2, 22500);
INSERT INTO season_region_score(season_id, region_id, score)
VALUES(1, 3, 27500);
INSERT INTO season_region_score(season_id, region_id, score)
VALUES(1, 4, 30000);
INSERT INTO season_region_score(season_id, region_id, score)
VALUES(2, 1, 65000);
INSERT INTO season_region_score(season_id, region_id, score)
VALUES(2, 2, 45000);
INSERT INTO season_region_score(season_id, region_id, score)
VALUES(2, 3, 55000);
INSERT INTO season_region_score(season_id, region_id, score)
VALUES(2, 4, 60000);


-- season_user_score 데이터
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (2, 1, 0);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (3, 1, 0);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (4, 1, 0);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (5, 1, 0);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (6, 1, 10);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (7, 1, 20);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (8, 1, 30);
-- 추가된 데이터
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (9, 1, 1000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (10, 1, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (11, 1, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (12, 1, 1000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (13, 1, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (14, 1, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (15, 1, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (16, 1, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (17, 1, 1000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (18, 1, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (19, 1, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (20, 1, 1000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (21, 1, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (22, 1, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (2, 2, 0);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (3, 2, 0);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (4, 2, 0);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (5, 2, 0);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (6, 2, 10);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (7, 2, 20);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (8, 2, 30);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (9, 2, 1000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (10, 2, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (11, 2, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (12, 2, 1000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (13, 2, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (14, 2, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (15, 2, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (16, 2, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (17, 2, 1000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (18, 2, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (19, 2, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (20, 2, 1000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (21, 2, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (22, 2, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (23, 2, 1000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (24, 2, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (25, 2, 3000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (26, 2, 1000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (27, 2, 2000);
INSERT INTO season_user_score(user_id, season_id, score)
VALUES (28, 2, 3000);


-- dictionary 데이터
INSERT INTO dictionary(name, description, is_playable) VALUES("jumpingJack", "신나게 뛰어봐요!", true);
INSERT INTO dictionary(name, description, is_playable) VALUES("lunge", "무릎 부상 주의!", true);
INSERT INTO dictionary(name, description, is_playable) VALUES("pushUp", "근본 상체 운동!", true);
INSERT INTO dictionary(name, description, is_playable) VALUES("squat", "자세에 주의하세요!", true);
INSERT INTO dictionary(name, description, is_playable) VALUES("sitUp", "자세에 주의하세요!", true);
INSERT INTO dictionary(name, description, is_playable) VALUES("plank", "1분 이상 할 수 있을까요?", false);

-- bossmonster 데이터
INSERT INTO boss_monster(season_id, name, hp, description, is_mainboss)
VALUES (1, "turtleneck", 10000, "거북목거북이는 심각한 거북목 상태로 인해 목이 비정상적으로 길어진 거북입니다. 느린 속도로 이동하며, 사람들에게 가까이 다가가 그들의 목을 아프게 만들고 거북목 증상을 유발합니다. 자신의 길어진 목을 자랑스럽게 생각하며, 이 증상이 더 많은 사람들에게 퍼지기를 바랍니다. 특히 장시간 앉아 있는 사람들을 목표로 삼습니다.", true);
INSERT INTO boss_monster(season_id, name, hp, description, is_mainboss)
VALUES (2, "burgerking", 500000, "버거슬라임은 머리에 커다란 햄버거를 얹은 채, 자신의 몸에서 나오는 기름기와 탄산으로 주변을 오염시키는 슬라임입니다. 그는 사람들에게 불건강한 음식을 강제로 먹이며, 체중 증가와 소화불량을 유발하려 합니다. 버거슬라임은 특히 패스트푸드를 자주 섭취하는 사람들에게 집착하며, 그들이 더 많은 버거를 먹도록 유혹합니다.", true);

-- user_boss_monster 데이터
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 2);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 3);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 4);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 5);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 6);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 7);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 8);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 9);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 10);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 11);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 12);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 13);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 14);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 15);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 16);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 17);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 18);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 19);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 20);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 21);
INSERT INTO user_boss_monster(boss_monster_id, user_profile_id)
VALUES (1, 22);





-- monster 데이터
INSERT INTO monster(name, stage, description)
VALUES ("fatiguebat", 0, "날개가 무거워 제대로 날지 못하는 박쥐. 사람들에게 무기력과 피로를 퍼뜨리며, 그들이 지치고 피곤해지길 바란다");
INSERT INTO monster(name, stage, description)
VALUES ("enteritisowl", 1, "예민한 성격의 올빼미로, 밤마다 사람들의 장에 가스를 채워넣는다. 그는 사람들을 배앓이로 괴롭히며, 그들이 끊임없이 화장실을 찾도록 만든다.");
INSERT INTO monster(name, stage, description)
VALUES ("diabeticlizard", 2, "단 것을 매우 좋아하는 도마뱀. 그는 사람들에게 달콤한 음식을 나눠주며, 그들이 과다한 당 섭취로 인해 당뇨병에 걸리기를 원한다.");
INSERT INTO monster(name, stage, description)
VALUES ("gloomylion", 3, "그의 울음소리는 사람들을 우울하게 만든다. 이 사자는 사람들의 마음을 짓누르며, 그들이 기운을 잃고 슬픔에 빠지기를 바란다.");
INSERT INTO monster(name, stage, description)
VALUES ("MigraineMedusa", 4, "뱀으로 이루어진 머리카락을 가진 메두사. 그녀가 응시하는 사람은 머리가 깨질 듯한 편두통을 겪게 된다. 그녀의 시선은 강력한 두통을 일으키며, 피해자는 고통에 몸부림친다.");
INSERT INTO monster(name, stage, description)
VALUES ("foodpoisoningwhale", 5, "부패한 음식을 좋아하는 거대한 고래. 그는 사람들이 상한 음식을 먹도록 유도해, 그들이 식중독에 걸려 고통스럽게 만든다.");
INSERT INTO monster(name, stage, description)
VALUES ("dryeyecrab", 6, "건조한 바람을 일으키는 게, 그는 사람들의 눈을 건조하게 만들어 불편함을 주는 것이 목표다. 그의 집게는 특히 모니터 앞에 있는 사람들의 눈에 자극을 준다.");
INSERT INTO monster(name, stage, description)
VALUES ("forgetfulduck", 7, "잊어버리기 쉬운 성격의 오리. 그는 사람들의 기억을 빼앗아가, 중요한 것들을 잊게 만들고 혼란스럽게 한다. 그의 깃털은 기억을 지우는 힘을 가지고 있다.");
INSERT INTO monster(name, stage, description)
VALUES ("lowtemperaturewolf", 8, "차가운 오라를 가진 늑대. 그는 사람들의 체온을 급격히 낮춰 저체온증에 걸리게 만든다. 그의 울음소리는 추위를 더 강하게 느끼게 만든다.");
INSERT INTO monster(name, stage, description)
VALUES ("mountainsicknesseagle", 9, "높은 산에서만 사는 수리로, 그의 영역에 들어오면 누구든지 고산병에 걸리게 된다. 그는 사람들의 호흡을 방해해, 그들이 숨쉬기 힘들게 만든다.");



-- user_monster 데이터
INSERT INTO user_monster(user_id, monster_id)
VALUES (6, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (7, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (8, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (9, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (10, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (11, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (12, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (13, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (14, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (15, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (16, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (17, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (18, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (19, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (20, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (21, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (22, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (23, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (24, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (25, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (26, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (27, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (28, 1);
INSERT INTO user_monster(user_id, monster_id)
VALUES (8, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (9, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (10, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (11, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (12, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (13, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (14, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (15, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (16, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (17, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (18, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (19, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (20, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (21, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (22, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (23, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (24, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (25, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (26, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (27, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (28, 2);
INSERT INTO user_monster(user_id, monster_id)
VALUES (8, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (19, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (20, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (21, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (22, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (23, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (24, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (25, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (26, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (27, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (28, 3);
INSERT INTO user_monster(user_id, monster_id)
VALUES (8, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (9, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (10, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (11, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (12, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (13, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (14, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (15, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (16, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (17, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (18, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (19, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (20, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (21, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (22, 4);
INSERT INTO user_monster(user_id, monster_id)
VALUES (8, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (9, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (14, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (15, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (16, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (17, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (18, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (19, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (20, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (21, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (22, 5);
INSERT INTO user_monster(user_id, monster_id)
VALUES (8, 6);
INSERT INTO user_monster(user_id, monster_id)
VALUES (9, 6);
INSERT INTO user_monster(user_id, monster_id)
VALUES (14, 6);
INSERT INTO user_monster(user_id, monster_id)
VALUES (15, 6);
INSERT INTO user_monster(user_id, monster_id)
VALUES (16, 6);
INSERT INTO user_monster(user_id, monster_id)
VALUES (17, 6);
INSERT INTO user_monster(user_id, monster_id)
VALUES (18, 6);
INSERT INTO user_monster(user_id, monster_id)
VALUES (19, 6);
INSERT INTO user_monster(user_id, monster_id)
VALUES (8, 7);
INSERT INTO user_monster(user_id, monster_id)
VALUES (16, 7);
INSERT INTO user_monster(user_id, monster_id)
VALUES (17, 7);
INSERT INTO user_monster(user_id, monster_id)
VALUES (18, 7);
INSERT INTO user_monster(user_id, monster_id)
VALUES (19, 7);
INSERT INTO user_monster(user_id, monster_id)
VALUES (8, 8);
INSERT INTO user_monster(user_id, monster_id)
VALUES (16, 8);
INSERT INTO user_monster(user_id, monster_id)
VALUES (19, 8);
INSERT INTO user_monster(user_id, monster_id)
VALUES (8, 9);
INSERT INTO user_monster(user_id, monster_id)
VALUES (16, 9);
INSERT INTO user_monster(user_id, monster_id)
VALUES (19, 9);
INSERT INTO user_monster(user_id, monster_id)
VALUES (8, 10);





-- room 데이터
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방1", 4, true, 30, 30, 3, "completed", 2); -- 2,3,4,5 / 1
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방2", 3, true, 60, 30, 2, "completed", 6); -- 6,7,8 / 2
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방3", 2, true, 90, 30, 1, "completed", 9); -- 9,10 / 3
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방4", 1, true, 120, 30, 1, "completed", 11); -- / 4
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방5", 4, true, 150, 30, 2, "completed", 12); -- 12 13 14 15 / 5
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방6", 3, true, 180, 30, 3, "completed", 16); -- 16 17 18 / 6
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방7", 2, true, 180, 30, 3, "completed", 19); -- 19 20 / 7
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방8", 1, true, 180, 30, 3, "completed", 21); -- 21 / 8
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("운동중1", 4, true, 30, 30, 3, "exercise", 9); -- 9,10,11,12 / 9
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("운동중2", 3, true, 60, 30, 2, "exercise", 13); -- 13,14,15 / 10
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("운동중3", 2, true, 90, 30, 1, "exercise", 16); -- 16,17 / 11
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("운동중4", 1, true, 120, 30, 1, "exercise", 18); -- 18 / 12
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("초보자 대기방", 4, true, 30, 30, 3, "waiting", 19); -- 19 / 13
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("운동 마니아방", 3, true, 60, 30, 2, "waiting", 20); -- 20,21 / 14
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("챔피언 대기방", 2, true, 90, 30, 1, "waiting", 22); -- 22 / 15
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("혼자있고싶네요", 1, true, 120, 30, 1, "waiting", 23); -- 23 / 16
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("싸피동문회", 3, true, 60, 30, 2, "waiting", 24); -- 24,25,26
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방9", 1, true, 180, 180, 3, "completed", 8); -- 8 / 18
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방10", 1, true, 150, 150, 2, "completed", 8); -- 8 / 19
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방11", 1, true, 120, 120, 2, "completed", 8); -- 8 / 20
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방12", 1, true, 90, 90, 3, "completed", 8); -- 8 / 21
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방13", 1, true, 60, 60, 2, "completed", 8); -- 8 / 22
INSERT INTO room(title, max_participants, is_public, round_time, rest_time, total_rounds, status, host_id)
VALUES ("완료방13", 1, true, 30, 30, 1, "completed", 8); -- 8 / 23

-- room_user 데이터
INSERT INTO room_user(room_id, user_id)
VALUES (1, 2);
INSERT INTO room_user(room_id, user_id)
VALUES (1, 3);
INSERT INTO room_user(room_id, user_id)
VALUES (1, 4);
INSERT INTO room_user(room_id, user_id)
VALUES (1, 5);
INSERT INTO room_user(room_id, user_id)
VALUES (2, 6);
INSERT INTO room_user(room_id, user_id)
VALUES (2, 7);
INSERT INTO room_user(room_id, user_id)
VALUES (2, 8);
INSERT INTO room_user(room_id, user_id)
VALUES (3, 9);
INSERT INTO room_user(room_id, user_id)
VALUES (3, 10);
INSERT INTO room_user(room_id, user_id)
VALUES (4, 11);
INSERT INTO room_user(room_id, user_id)
VALUES (5, 12);
INSERT INTO room_user(room_id, user_id)
VALUES (5, 13);
INSERT INTO room_user(room_id, user_id)
VALUES (5, 14);
INSERT INTO room_user(room_id, user_id)
VALUES (5, 15);
INSERT INTO room_user(room_id, user_id)
VALUES (6, 16);
INSERT INTO room_user(room_id, user_id)
VALUES (6, 17);
INSERT INTO room_user(room_id, user_id)
VALUES (6, 18);
INSERT INTO room_user(room_id, user_id)
VALUES (7, 19);
INSERT INTO room_user(room_id, user_id)
VALUES (7, 20);
INSERT INTO room_user(room_id, user_id)
VALUES (8, 21);
INSERT INTO room_user(room_id, user_id)
VALUES (9, 9);
INSERT INTO room_user(room_id, user_id)
VALUES (9, 10);
INSERT INTO room_user(room_id, user_id)
VALUES (9, 11);
INSERT INTO room_user(room_id, user_id)
VALUES (9, 12);
INSERT INTO room_user(room_id, user_id)
VALUES (10, 13);
INSERT INTO room_user(room_id, user_id)
VALUES (10, 14);
INSERT INTO room_user(room_id, user_id)
VALUES (10, 15);
INSERT INTO room_user(room_id, user_id)
VALUES (11, 16);
INSERT INTO room_user(room_id, user_id)
VALUES (11, 17);
INSERT INTO room_user(room_id, user_id)
VALUES (12, 18);
INSERT INTO room_user(room_id, user_id)
VALUES (13, 19);
INSERT INTO room_user(room_id, user_id)
VALUES (14, 20);
INSERT INTO room_user(room_id, user_id)
VALUES (14, 21);
INSERT INTO room_user(room_id, user_id)
VALUES (15, 22);
INSERT INTO room_user(room_id, user_id)
VALUES (16, 23);
INSERT INTO room_user(room_id, user_id)
VALUES (17, 24);
INSERT INTO room_user(room_id, user_id)
VALUES (17, 25);
INSERT INTO room_user(room_id, user_id)
VALUES (17, 26);
INSERT INTO room_user(room_id, user_id)
VALUES (18, 8);
INSERT INTO room_user(room_id, user_id)
VALUES (19, 8);
INSERT INTO room_user(room_id, user_id)
VALUES (20, 8);
INSERT INTO room_user(room_id, user_id)
VALUES (21, 8);
INSERT INTO room_user(room_id, user_id)
VALUES (22, 8);
INSERT INTO room_user(room_id, user_id)
VALUES (23, 8);

-- exercie_room_record 데이터
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (2, 1, 20240701091530, 0, 60, 4, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (3, 1, 20240701091530, 10, 60, 4, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (4, 1, 20240701091530, 20, 60, 4, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (5, 1, 20240701091530, 30, 60, 4, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (6, 2, 20240813091530, 1000, 6000, 3, 2);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (7, 2, 20240813091530, 2000, 6000, 3, 2);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (8, 2, 20240813091530, 3000, 6000, 3, 2);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (9, 3, 20240813082530, 1000, 3000, 2, 2);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (10, 3, 20240813082530, 2000, 3000, 2, 2);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (11, 4, 20240813082530, 800, 800, 1, 1);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (12, 5, 20240701091530, 0, 60, 4, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (13, 5, 20240701091530, 10, 60, 4, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (14, 5, 20240701091530, 20, 60, 4, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (15, 5, 20240701091530, 30, 60, 4, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (16, 6, 20240813091530, 1000, 6000, 3, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (17, 6, 20240813091530, 2000, 6000, 3, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (18, 6, 20240813091530, 3000, 6000, 3, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (19, 7, 20240813082530, 1000, 3000, 2, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (20, 7, 20240813082530, 2000, 3000, 2, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (21, 8, 20240813082530, 800, 800, 1, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (8, 18, 20240813102530, 10000, 10000, 1, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (8, 19, 20240813104530, 6000, 6000, 1, 2);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (8, 20, 20240813110525, 3500, 3500, 1, 1);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (8, 21, 20240813114500, 10000, 10000, 1, 3);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (8, 22, 20240813121530, 6000, 6000, 1, 2);
INSERT INTO exercise_room_record(user_id, room_id, end_time, personal_combat_power, total_combat_power, participants_count, stage)
VALUES (8, 23, 20240813180513, 3500, 3500, 1, 1);


-- round_record 데이터
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (1, 1, 1, 0);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (1, 2, 2, 0);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (1, 3, 2, 0);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (2, 1, 3, 2);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (2, 2, 4, 3);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (2, 3, 5, 5);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (3, 1, 3, 4);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (3, 2, 2, 6);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (3, 3, 1, 10);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (4, 1, 4, 6);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (4, 2, 4, 9);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (4, 3, 4, 15);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (5, 1, 3, 20);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (5, 2, 2, 30);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (6, 1, 4, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (6, 2, 4, 60);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (7, 1, 3, 60);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (7, 2, 3, 90);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (8, 1, 3, 20);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (8, 2, 2, 30);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (9, 1, 4, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (9, 2, 4, 60);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (10, 1, 4, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (11, 1, 1, 0);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (11, 2, 2, 0);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (11, 3, 2, 0);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (12, 1, 3, 2);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (12, 2, 4, 3);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (12, 3, 5, 5);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (13, 1, 3, 4);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (13, 2, 2, 6);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (13, 3, 1, 10);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (14, 1, 4, 6);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (14, 2, 4, 9);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (14, 3, 4, 15);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (15, 1, 3, 20);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (15, 2, 2, 30);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (15, 2, 2, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (16, 1, 4, 30);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (16, 2, 4, 30);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (16, 3, 4, 20);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (17, 1, 5, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (17, 2, 3, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (17, 3, 2, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (18, 1, 4, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (18, 2, 2, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (18, 3, 3, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (19, 1, 1, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (19, 2, 1, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (19, 3, 3, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (20, 1, 2, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (20, 2, 5, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (20, 3, 3, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (21, 1, 3, 60);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (21, 2, 4, 50);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (21, 3, 5, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (22, 1, 1, 50);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (22, 2, 5, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (23, 1, 1, 50);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (24, 1, 1, 60);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (24, 2, 2, 50);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (24, 3, 5, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (25, 1, 3, 50);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (25, 2, 2, 40);
INSERT INTO round_record(exercise_room_record_id, round_number, dictionary_id, exercise_count)
VALUES (26, 1, 4, 50);