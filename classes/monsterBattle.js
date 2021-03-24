//Include parent class
const monster = require('./monster.js');

// class for monsters encounted in battle, adds the drops that they have
module.exports = class monsterBattle extends monster{

    constructor(name, attack, defence,hp, xp, gold, json, emoji, drop){
        super(name, attack, defence,hp, xp, gold, json, emoji);
        this.drop = drop;
    }

}