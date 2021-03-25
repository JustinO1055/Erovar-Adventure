//Include parent class
const monster = require('./monster.js');

// include monsters json
const MONSTERS = require('../jsons/monsters.json');

// class for the boss that is encountered within higher areas
// extends general monster adding attack and defence
module.exports = class bossDamage extends monster{

    // constructor to create the object
    constructor(area){
        // call super class constructor
        // read the data from the json and use that information to create the boss object
        for(var m in MONSTERS[`area${area}`][`boss`]){
            super(MONSTERS[`area${area}`][`boss`][`${m}`].name, MONSTERS[`area${area}`][`boss`][`${m}`].hp, m , MONSTERS[`area${area}`][`boss`][`${m}`].emoji);
            // add aditional items, att/def
            this.attack = MONSTERS[`area${area}`][`boss`][`${m}`].attack;
            this.defence = MONSTERS[`area${area}`][`boss`][`${m}`].defence;
        }
    }

}