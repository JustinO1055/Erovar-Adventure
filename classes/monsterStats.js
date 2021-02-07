//Class for each monster that can be encountered
module.exports = class monsterStats {
    constructor(name, encounter, minattack, maxattack, mindefence, maxdefence, minhp, maxhp, minxp, maxxp, emoji) {
        this.name = name;
        this.encounter = encounter;
        this.attack = [minattack, maxattack];
        this.defence = [mindefence, maxdefence];
        this.hp = [minhp, maxhp];
        this.xp = [minxp, maxxp];
        this.emoji = emoji;
    }
};