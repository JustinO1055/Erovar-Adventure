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
        this.hp = health;

        //If health drops below 0, set it to 0
        if(this.hp < 0)
            this.hp = 0;
    }
}