ALTER TABLE monster
ADD COLUMN description VARCHAR(255);

ALTER TABLE boss_monster
ADD COLUMN description VARCHAR(255);

ALTER TABLE boss_monster
ADD COLUMN is_mainboss BOOLEAN DEFAULT FALSE;