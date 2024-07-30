-- Check if the 'Dictionary' table exists and rename it to 'dictionary'
IF EXISTS (SELECT * FROM information_schema.tables
           WHERE table_schema = DATABASE() AND table_name = 'Dictionary') THEN
ALTER TABLE `Dictionary` RENAME TO `dictionary`;
END IF;

-- Check if the 'Monster' table exists and rename it to 'monster'
IF EXISTS (SELECT * FROM information_schema.tables
           WHERE table_schema = DATABASE() AND table_name = 'Monster') THEN
ALTER TABLE `Monster` RENAME TO `monster`;
END IF;

-- Check if the 'Region' table exists and rename it to 'region'
IF EXISTS (SELECT * FROM information_schema.tables
           WHERE table_schema = DATABASE() AND table_name = 'Region') THEN
ALTER TABLE `Region` RENAME TO `region`;
END IF;

-- Check if the 'Report' table exists and rename it to 'report'
IF EXISTS (SELECT * FROM information_schema.tables
           WHERE table_schema = DATABASE() AND table_name = 'Report') THEN
ALTER TABLE `Report` RENAME TO `report`;
END IF;

-- Check if the 'Room' table exists and rename it to 'room'
IF EXISTS (SELECT * FROM information_schema.tables
           WHERE table_schema = DATABASE() AND table_name = 'Room') THEN
ALTER TABLE `Room` RENAME TO `room`;
END IF;

-- Check if the 'Season' table exists and rename it to 'season'
IF EXISTS (SELECT * FROM information_schema.tables
           WHERE table_schema = DATABASE() AND table_name = 'Season') THEN
ALTER TABLE `Season` RENAME TO `season`;
END IF;

-- Check if the 'User' table exists and rename it to 'user'
IF EXISTS (SELECT * FROM information_schema.tables
           WHERE table_schema = DATABASE() AND table_name = 'User') THEN
ALTER TABLE `User` RENAME TO `user`;
END IF;
