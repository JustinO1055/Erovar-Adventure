//Include parent class
const monster = require('./monster.js');

// class for monsters encountered  in battle, 

//adds the attack, defence, xp, gold and drops that they have
module.exports = class monsterBattle extends monster{

    constructor(name, attack, defence, hp, xp, gold, json, emoji, drop){
        super(name, hp, json, emoji);
        this.attack = attack;
        this.defence = defence;
        this.xp = xp;
        this.gold = gold;
        this.drop = drop;
    }

}