//Include parent class
const monster = require('./monster.js');

// class for monsters encountered  in expedition, 
//adds the attack, defence, xp, gold and moves that they have
module.exports = class monsterExpedition extends monster{

    constructor(name, attack, defence, hp, xp, gold, json, emoji, moves){
        super(name, hp, json, emoji);
        this.attack = attack;
        this.defence = defence;
        this.xp = xp;
        this.gold = gold;
        this.moves = moves;
    }


}