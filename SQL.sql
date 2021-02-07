CREATE TABLE Users (
  id varchar(20) NOT NULL,
  xp int(10) DEFAULT 0,
  area int DEFAULT 0,
  max_area int DEFAULT 0,
  admin int(11) DEFAULT 0,
  gold BIGINT DEFAULT 0,
  sword VARCHAR(20) DEFAULT 'NONE',
  shield VARCHAR(20) DEFAULT 'NONE',
  armor VARCHAR(20) DEFAULT 'NONE',
  pickaxe VARCHAR(20) DEFAULT 'NONE',
  axe VARCHAR(20) DEFAULT 'NONE',
  max_hp INT DEFAULT 100,
  hp INT DEFAULT 100,
  attack INT DEFAULT 1,
  DEFENCE INT DEFAULT 1,
  PRIMARY KEY (id),
  CHECK(area >= 0 AND gold >= 0) 
) engine = 'innoDB';

CREATE TABLE Inventory (

  id VARCHAR(20) PRIMARY KEY,
  pebble INT NOT NULL DEFAULT 0,
  stone INT NOT NULL DEFAULT 0,
  stick INT NOT NULL DEFAULT 0,
  log INT NOT NULL DEFAULT 0,
  FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE,
  CHECK(pebble >= 0 AND stone >=0 AND stick >= 0 AND log >= 0)
  
) engine = "innoDB";

CREATE TABLE Cooldown(

  id VARCHAR(20) PRIMARY KEY,
  cd_gather DATETIME NOT NULL DEFAULT '2020-12-01 00:00:00',
  FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE

) engine = "innoDB";

CREATE TABLE Consumables(
  
  id VARCHAR(20) PRIMARY KEY,
  healthpotion INT DEFAULT 0,
  FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE

) engine = "innoDB";