CREATE TABLE Users (
  id varchar(20) NOT NULL,
  xp int(10) DEFAULT 0,
  area int DEFAULT 0,
  max_area int DEFAULT 0,
  admin int(11) DEFAULT 0,
  gold BIGINT DEFAULT 500,
  sword VARCHAR(64) DEFAULT 'NONE',
  shield VARCHAR(64) DEFAULT 'NONE',
  armor VARCHAR(64) DEFAULT 'NONE',
  pickaxe VARCHAR(64) DEFAULT 'NONE',
  axe VARCHAR(64) DEFAULT 'NONE',
  max_hp INT DEFAULT 100,
  hp INT DEFAULT 100,
  attack INT DEFAULT 1,
  defence INT DEFAULT 1,
  level INT DEFAULT 1,
  PRIMARY KEY (id),
  CHECK(area >= 0 AND gold >= 0) 
) engine = 'innoDB';

CREATE TABLE Inventory (

  id VARCHAR(20) PRIMARY KEY,
  pebble INT NOT NULL DEFAULT 0,
  stone INT NOT NULL DEFAULT 0,
  stick INT NOT NULL DEFAULT 0,
  log INT NOT NULL DEFAULT 0,
  pine_log INT NOT NULL DEFAULT 0,
  health_potion INT NOT NULL DEFAULT 5,
  copper_ore INT NOT NULL DEFAULT 0,
  copper_ingot INT NOT NULL DEFAULT 0,
  cowhide INT NOT NULL DEFAULT 0,
  leather INT NOT NULL DEFAULT 0,
  shark_tooth INT NOT NULL DEFAULT 0,
  wolf_pelt INT NOT NULL DEFAULT 0
  narwhal_horn INT NOT NULL DEFAULT 0,
  health_boost_a INT NOT NULL DEFAULT 0,
  health_boost_b INT NOT NULL DEFAULT 0,
  defence_boost_a INT NOT NULL DEFAULT 0,
  defence_boost_b INT NOT NULL DEFAULT 0,
  attack_boost_a INT NOT NULL DEFAULT 0,
  attack_boost_b INT NOT NULL DEFAULT 0,
  tin_ore INT NOT NULL DEFAULT 0,
  bronze_ingot INT NOT NULL DEFAULT 0,
  mahogany_log INT NOT NULL DEFAULT 0,
  iron_ore INT NOT NULL DEFAULT 0,
  iron_ingot INT NOT NULL DEFAULT 0,
  redwood_log INT NOT NULL DEFAULT 0,
  FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE,
  CHECK(pebble >= 0 AND stone >=0 AND stick >= 0 AND log >= 0)
  
) engine = "innoDB";

CREATE TABLE Cooldown(

  id VARCHAR(20) PRIMARY KEY,
  cd_gather DATETIME NOT NULL DEFAULT '2020-12-01 00:00:00',
  cd_sleep DATETIME NOT NULL DEFAULT '2020-12-01 00:00:00',
  cd_battle DATETIME NOT NULL DEFAULT '2020-12-01 00:00:00',
  cd_expedition DATETIME NOT NULL DEFAULT '2020-12-01 00:00:00',
  cd_boss DATETIME NOT NULL DEFAULT '2020-12-01 00:00:00',
  cd_learn DATETIME NOT NULL DEFAULT '2020-12-01 00:00:00',
  FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE

) engine = "innoDB";

CREATE TABLE Skills (
    id VARCHAR(20) NOT NULL PRIMARY KEY,
    gathering INT NOT NULL DEFAULT 0,
    artisan INT NOT NULL DEFAULT 0,    
    FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Stats (
    id VARCHAR(20) NOT NULL PRIMARY KEY,
    greensnake INT NOT NULL DEFAULT 0,
    seagull INT NOT NULL DEFAULT 0,
    wasp INT NOT NULL DEFAULT 0,
    blackbat INT NOT NULL DEFAULT 0,
    ghostly INT NOT NULL DEFAULT 0,
    jelly INT NOT NULL DEFAULT 0,
    goblin INT NOT NULL DEFAULT 0,
    cow INT NOT NULL DEFAULT 0,
    spider INT NOT NULL DEFAULT 0,
    skeleton INT NOT NULL DEFAULT 0,
    cowhide INT NOT NULL DEFAULT 0,
    shark INT NOT NULL DEFAULT 0,
    vampire INT NOT NULL DEFAULT 0,
    ent INT NOT NULL DEFAULT 0,
    werewolf INT NOT NULL DEFAULT 0,
    eye INT NOT NULL DEFAULT 0,
    vespera INT NOT NULL DEFAULT 0,
    narwhal INT NOT NULL DEFAULT 0,
    mushroom INT NOT NULL DEFAULT 0,
    mimic INT NOT NULL DEFAULT 0,
    imp INT NOT NULL DEFAULT 0,
    skullbat INT NOT NULL DEFAULT 0,
    wizard INT NOT NULL DEFAULT 0,
    wolf_pelt INT NOT NULL DEFAULT 0,
    shark_tooth INT NOT NULL DEFAULT 0,
    narwhal_horn INT NOT NULL DEFAULT 0,
    health_boost_a INT NOT NULL DEFAULT 0,
    health_boost_b INT NOT NULL DEFAULT 0,
    attack_boost_a INT NOT NULL DEFAULT 0,
    attack_boost_b INT NOT NULL DEFAULT 0,
    defence_boost_a INT NOT NULL DEFAULT 0,
    defence_boost_b INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE

) engine = "innoDB";
