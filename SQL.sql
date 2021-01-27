CREATE TABLE Users (
  id varchar(20) NOT NULL,
  xp int(10) DEFAULT 0,
  area int DEFAULT 0,
  max_area int DEFAULT 0,
  admin int(11) DEFAULT 0,
  sword VARCHAR(20) DEFAULT 'NONE',
  shield VARCHAR(20) DEFAULT 'NONE',
  armor VARCHAR(20) DEFAULT 'NONE',
  pickaxe VARCHAR(20) DEFAULT 'NONE',
  axe VARCHAR(20) DEFAULT 'NONE',
  PRIMARY KEY (id)
) engine = 'innoDB';

CREATE TABLE Inventory (

  id VARCHAR(20) PRIMARY KEY,
  pebble INT NOT NULL DEFAULT 0,
  stone INT NOT NULL DEFAULT 0,
  stick INT NOT NULL DEFAULT 0,
  log INT NOT NULL DEFAULT 0,
  FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE
  
) engine = "innoDB";