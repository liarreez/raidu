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
