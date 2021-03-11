//Class for each monster that can be encountered
module.exports = class monsterStats {
    constructor(name, probability, minattack, maxattack, mindefence, maxdefence, minhp, maxhp, minxp, maxxp, mingold, maxgold, emoji, moves, drops, json) {
        this.name = name;
        this.probability = probability;
        this.attack = [minattack, maxattack];
        this.defence = [mindefence, maxdefence];
        this.hp = [minhp, maxhp];
        this.xp = [minxp, maxxp];
        this.gold = [mingold, maxgold];
        this.emoji = emoji;
        this.moves = moves;
        this.drops = drops;
        this.json = json;
    }
};