-- Dictionary 테이블 이름 변경
DO
$$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'Dictionary') THEN
ALTER TABLE `Dictionary` RENAME TO `dictionary`;
END IF;
END
$$;

-- Monster 테이블 이름 변경
DO
$$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'Monster') THEN
ALTER TABLE `Monster` RENAME TO `monster`;
END IF;
END
$$;

-- Region 테이블 이름 변경
DO
$$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'Region') THEN
ALTER TABLE `Region` RENAME TO `region`;
END IF;
END
$$;

-- Report 테이블 이름 변경
DO
$$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'Report') THEN
ALTER TABLE `Report` RENAME TO `report`;
END IF;
END
$$;

-- Room 테이블 이름 변경
DO
$$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'Room') THEN
ALTER TABLE `Room` RENAME TO `room`;
END IF;
END
$$;

-- Season 테이블 이름 변경
DO
$$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'Season') THEN
ALTER TABLE `Season` RENAME TO `season`;
END IF;
END
$$;

-- User 테이블 이름 변경
DO
$$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'User') THEN
ALTER TABLE `User` RENAME TO `user`;
END IF;
END
$$;
