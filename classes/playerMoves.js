// Class that is designed to store the various moves that the player has within boss battles.

module.exports = class playerMoves {
    constructor(moveName, moveChance, moveDamage){
        this.mName = moveName;
        this.chance = moveChance;
        this.damage = moveDamage;
    }
}