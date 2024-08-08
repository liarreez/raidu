CREATE TABLE `email_code` (
                        `id` BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                        `email` VARCHAR(50) UNIQUE NOT NULL,
                        `code` VARCHAR(255) NOT NULL,
                        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE EVENT IF NOT EXISTS delete_old_email_code
ON SCHEDULE EVERY 181 second
DO
DELETE FROM email_code WHERE created_at < NOW() - INTERVAL 3 minute;