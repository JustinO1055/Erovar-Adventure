// base information for monsters
// stores name, hp, emoji, json
// all monsters will have these elements
// used as a base class 
// needed to display the monster to fight

module.exports = class monster{
    constructor(name, hp, json, emoji){
        this.name = name;
        this.hp = hp;
        this.json = json;
        this.emoji = emoji
    }
}