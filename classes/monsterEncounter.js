//Include the js file with functions, that includes the random function
var functions = require('../functions.js');

// include monsters json
const MONSTERS = require('../jsons/monsters.json');

//Include the js file that contains the resourceDrop class
var resourceDrop = require('../classes/resourceDrop.js');
var dropTable = require('../classes/dropTable.js');

// include monster classes
const monsterBattle = require('../classes/monsterBattle.js');
const monsterExpedition = require('../classes/monsterExpedition.js');

//Include parent class
const entityTable = require('./entityTable.js');

//Class for a drop table that used the resourceDrop
module.exports = class monsterTable extends entityTable {

    // function to determine which monster and stats is encountered 
    determineHit() {
        //Generate random number for determining which item will be recieved
        var randomNum  = functions.randomInteger(1, this.probabilitySum());

        //Used while going through each probability
        var runningValue = 1, monster, monsterHP, monsterAtt, monsterDef, monsterEmoji, monsterXP, monsterMoves, monsterGold;
        var area, type, json;
        var monsterDrop = [null, null];

        //Find which monster is encountered
        for(let element of this.entities){
            runningValue += element.probability;
            if(randomNum < runningValue){
                area = element.area;
                type = element.type;
                json = element.json;
                
                monster = MONSTERS[`area${area}`][`${type}`][`${json}`].name;
                // compute the stats for the encountered monster by finding a random number within its stats range
                monsterAtt = functions.randomInteger(MONSTERS[`area${area}`][`${type}`][`${json}`].minattack, MONSTERS[`area${area}`][`${type}`][`${json}`].maxattack);
                monsterDef = functions.randomInteger(MONSTERS[`area${area}`][`${type}`][`${json}`].mindefence, MONSTERS[`area${area}`][`${type}`][`${json}`].maxdefence);
                monsterHP = functions.randomInteger(MONSTERS[`area${area}`][`${type}`][`${json}`].minhp, MONSTERS[`area${area}`][`${type}`][`${json}`].maxhp);
                monsterEmoji = MONSTERS[`area${area}`][`${type}`][`${json}`].emoji;
                monsterXP = functions.randomInteger(MONSTERS[`area${area}`][`${type}`][`${json}`].minxp, MONSTERS[`area${area}`][`${type}`][`${json}`].maxxp);
                monsterGold = functions.randomInteger(MONSTERS[`area${area}`][`${type}`][`${json}`].mingold, MONSTERS[`area${area}`][`${type}`][`${json}`].maxgold);

                // if its expedition, set moves
                if(type == "expedition")
                    monsterMoves = MONSTERS[`area${area}`][`${type}`][`${json}`].moves;
                else
                    monsterMoves = null;

                // if its battle set drop
                if(type == "battle"){
                    // create monster item drop table
                    var monsterDropTable = new dropTable;
                    
                    // push all the possible drops into table
                    for(var i = 0; i < MONSTERS[`area${area}`][`${type}`][`${json}`].drops.length; i++){
                        monsterDropTable.addEntity(new resourceDrop(MONSTERS[`area${area}`][`${type}`][`${json}`].drops[i][0], MONSTERS[`area${area}`][`${type}`][`${json}`].drops[i][1], 1, 1));
                    }
                    monsterDrop = monsterDropTable.determineHit();

                }
                break;
            }
        }
        // return the monster object specific to the type
        if(type == "battle"){
            return new monsterBattle(monster, monsterAtt, monsterDef, monsterHP, monsterXP, monsterGold, json, monsterEmoji, monsterDrop[0]);
        } else if (type == "expedition"){
            return new monsterExpedition(monster, monsterAtt, monsterDef, monsterHP, monsterXP, monsterGold, json, monsterEmoji, monsterMoves);
        } else {
            return "error";
        }
    }

};

