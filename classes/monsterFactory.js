// include the json file that holds all of the monsters names, emoji codes and information
const bossTutorial = require('./bossTutorial.js');
const bossDamage = require('./bossDamage.js');
const MONSTERS = require('../jsons/monsters.json');
const monsterEncounter = require('./monsterEncounter.js');

// class for the monsterFactory
// provide the required arguments for a monster
// this factory automatically creates the correct monster for the given information
// will automatically select a random monster for battle/ expedition

module.exports = class monsterFactory{

    static createMonster(type, area){

        if (type == "battle" || type == "expedition"){
            let monsterEncounterTable = new monsterEncounter();
            // go through the json for that area
            for(var m in MONSTERS[`area${area}`][`${type}`]){
                // add the information for that monster to the encounter table.
                // passes in each monsters probability, its json name, the type (battle or exp), and the area found in
                monsterEncounterTable.addEntity({
                    probability: MONSTERS[`area${area}`][`${type}`][m]['encounter'],
                    json: m,
                    type: type,
                    area: area});
            }

            // return the correct monster type for the monster that has been randomly generated
            return monsterEncounterTable.determineHit();
        } else if (type == "tutorial") {
            return new bossTutorial(area);
        } else if (type == "damage"){
            return new bossDamage(area);
        }
    }
}