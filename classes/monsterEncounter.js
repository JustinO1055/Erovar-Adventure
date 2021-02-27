//Include the js file with functions, that includes the random function
var functions = require('../functions.js');

//Include the js file that contains the resourceDrop class
var resourceDrop = require('../classes/resourceDrop.js');
var dropTable = require('../classes/dropTable.js');

//Class for a drop table that used the resourceDrop
module.exports = class monsterEncounter {
    monsters = [];

    // adds the monster to the drop table list
    addMonster(monsterStats) {
        this.monsters.push(monsterStats);
    } 

    // function to compute the sum of the encounter chance of each monster in the list
    encounterSum() {
        var encounterSum = 0;
        this.monsters.forEach(element => {
            encounterSum += element.encounter;
        });
        return encounterSum;
    }

    // function to determine which monster and stats is encountered 
    determineHit() {
        //Generate random number for determining which item will be recieved
        var randomNum  = functions.randomInteger(1, this.encounterSum());

        //Used while going through each probability
        var runningValue = 1, monster, monsterHP, monsterAtt, monsterDef, monsterEmoji, monsterxp, monsterMoves, monsterGold, monsterJson;
        var monsterDrop = [null, null];

        console.log(randomNum);

        //Find which monster is encountered
        for(let element of this.monsters){
            runningValue += element.encounter;
            if(randomNum < runningValue){
                monster = element.name;
                // compute the stats for the encountered monster by finding a random number within its stats range
                monsterAtt = functions.randomInteger(element.attack[0], element.attack[1]);
                monsterDef = functions.randomInteger(element.defence[0], element.defence[1]);
                monsterHP = functions.randomInteger(element.hp[0], element.hp[1]);
                monsterEmoji = element.emoji;
                monsterxp = functions.randomInteger(element.xp[0], element.xp[1]);
                monsterGold = functions.randomInteger(element.gold[0], element.gold[1]);
                monsterJson = element.json;
                if(typeof(element.moves)!='undefined' && (element.moves) != null)
                    monsterMoves = element.moves;
                else
                    monsterMoves = null;
                
                if(typeof(element.drops)!='undefined' && (element.drops) != null){
                    // create monster item drop table
                    var monsterDropTable = new dropTable;
                    
                    // push all the possible drops into table
                    for(var i = 0; i < element.drops.length; i++){
                        monsterDropTable.addResource(new resourceDrop(element.drops[i][0], element.drops[i][1], 1, 1));
                    }
                    monsterDrop = monsterDropTable.determineHit();

                }
                break;
            }
        }
        // return the monster and its stats
        return [monster, monsterAtt, monsterDef, monsterHP, monsterEmoji, monsterxp, monsterGold, monsterMoves, monsterDrop[0], monsterJson];
    }

};

