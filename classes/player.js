module.exports = class monsterStats {
    constructor(id, name, health = 0, max_health = 0, attack = 0, defence = 0){
        this.id = id;
        this.username = name;
        this.hp = [health, max_health];
        this.attack = attack;
        this.defence = defence;
    }

    //Function to inflict damage to player
    playerHit(health){
        //Reduce health by damage
        this.hp[0] = health;
    }
}