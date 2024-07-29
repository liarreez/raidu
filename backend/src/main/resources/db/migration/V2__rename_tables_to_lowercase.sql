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
