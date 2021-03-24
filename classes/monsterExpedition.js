//Include parent class
const monster = require('./monster.js');

// class for monsters encounted in expedition, adds the moves that they have
module.exports = class monsterExpedition extends monster{

    constructor(name, attack, defence,hp, xp, gold, json, emoji, moves){
        super(name, attack, defence,hp, xp, gold, json, emoji);
        this.moves = moves;
    }

}