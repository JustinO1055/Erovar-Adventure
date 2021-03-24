// include the json file that holds all of the monsters names, emoji codes and information
const MONSTERS = require('../jsons/monsters.json');
var monsterEncounter = require('./monsterEncounter.js');

module.exports = class monsterFactory{


    static createMonster(type, area){

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
    }
}