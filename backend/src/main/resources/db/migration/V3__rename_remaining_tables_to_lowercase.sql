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
