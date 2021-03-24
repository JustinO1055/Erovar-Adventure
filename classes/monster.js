// base information for monsters
// stores name, attack, defence,hp, xp, gold, json
// needed to display the monster to fight

module.exports = class monster{
    constructor(name, attack, defence,hp, xp, gold, json, emoji){
        this.name = name;
        this.attack = attack;
        this.defence = defence;
        this.hp = hp;
        this.xp = xp;
        this.gold = gold;
        this.json = json;
        this.emoji = emoji
    }
}