//Include parent class
const monster = require('./monster.js');

// include monsters json
const MONSTERS = require('../jsons/monsters.json');

// class for the boss that is encountered within tutorial
// extends base monster adding moves
module.exports = class bossTutorial extends monster{

    // constructor to create the object
    constructor(area){
        // call super class constructor
        // read the data from the json and use that information to create the boss object
        for(var m in MONSTERS[`area${area}`][`boss`]){
            super(MONSTERS[`area${area}`][`boss`][`${m}`].name, MONSTERS[`area${area}`][`boss`][`${m}`].hp, m , MONSTERS[`area${area}`][`boss`][`${m}`].emoji);
            this.moves = MONSTERS[`area${area}`][`boss`][`${m}`].moves;
        }
    }

}