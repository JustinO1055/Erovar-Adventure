// include the items json file
const {items} = require('./jsons/items.json');

module.exports = {
    playerDeath: function(message, currentLevel, area) {
        if(area != 0){
            message.channel.send("You died. Your XP has been reset back to 0 for your current level.")

            xpValues = this.xpCurrentNext(currentLevel);

            sql = `UPDATE Users SET hp = hp_max, xp = ${xpValues[0]} WHERE id = ${message.author.id}`;
            connection.query(sql);
        } else {
            message.channel.send("You feel your life fade before you. At the last second a magical healing fairy saves your life.\nThe fairy tells you to be more careful as she wont help you after you leave area 0.")
        }
    },
    xpCurrentNext: function(level) {
        var xpCurrent = Math.round(4408417000 + (109.1345 - 4408417000)/(1 + Math.pow(((level- 1)/457.4632),3.390761)));
        var xpNext = Math.round(4408417000 + (109.1345 - 4408417000)/(1 + Math.pow((level/457.4632),3.390761)));

        return [xpCurrent, xpNext];
    },
    battleSuccess: function(message, currentLevel, xpCurrent, xpObtained, hp, gold) {
        //Get how much xp for player to level up
        xpValues = this.xpCurrentNext(currentLevel);

        //Determine if the player leveled up
        if(xpCurrent + xpObtained > xpValues[1]){
            //Variable to track number of times a player leveled up
            lvls = 0;

            //Find out how many times the player leveled up
            while(xpCurrent + xpObtained > xpValues[1]) {
                lvls++;
                xpValues = this.xpCurrentNext(currentLevel + lvls);
            }

            //Output Level Up message
            if(lvls > 1)
                message.channel.send(`You have leveled up ${lvls} times!\n+${lvls * 5} HP :heart: +${lvls} Attack :crossed_swords: +${lvls} Defence :shield:`);
            else   
                message.channel.send(`You have leveled up!\n+5 HP :heart: +1 Attack :crossed_swords: +1 Defence :shield:`);

            //Create query to update users data, inlcuding a level up
            sql =`UPDATE Users SET hp = max_hp + 5 * ${lvls}, xp = xp + ${xpObtained}, gold = gold + ${gold}, level = level + 1 * ${lvls}, max_hp = max_hp + 5 * ${lvls}, attack = attack + 1 * ${lvls}, defence = defence + 1 * ${lvls} WHERE id = ${message.author.id}`;
        } else{
            //Create query to update users data, not inlcuding a level up
            sql =`UPDATE Users SET hp = ${hp}, xp = xp + ${xpObtained}, gold = gold + ${gold} WHERE id = ${message.author.id}`;
        }

        connection.query(sql);
    },
    // function to generate a random Integer between two numbers
    randomInteger: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    threeRandomInteger: function(){
        // function to compute three random numbers that add up to a total of 100
        let number1 = this.randomInteger(0,100);
        let number2 = this.randomInteger(0,(100- number1));
        let number3 = 100 - number1 - number2;
        return [number1, number2, number3];
    },
    calcAmount: function(input){
        // regex for finding if the user has valid input
        var regex = /\d+(\.\d+)?[kmb]?$/;
    
        //test the input based off the regex
        // if its valid, continue to pasre the input.
        if(regex.test(input)){
    
            // set the multiplier value for the k m b modifier
            var multiplier = 1;
    
            // figure out if there is a letter
            var isLetter = /[kmb]/i;
            var letter = input.match(isLetter);
            // if letter found, store its value
            if(letter != null){
                // figure out which letter
                // store its multiplier
                switch(letter[0]){
                    case 'k':
                        multiplier = 1000;
                        break;
                    case 'm':
                        multiplier = 1000000;
                        break;
                    case 'b':
                        multiplier = 1000000000;
                        break;
                }
                // remove the k b or m
                input = input.replace(letter[0], '');
            }
    
            // convert the input to float
            input = parseFloat(input);
            // convert to int after multiplying
            var value = parseInt(input * multiplier);
            return value;
    
        // otherwise return -1 (error)
        } else {
            return -1;
        }
    },
    //function to get the emoji id for an item
    getEmoji: function(item){
        // traverse the items json file to find the item requested
        for(i in items){
            if(i == item)
                // return the emoji id
                return (items[i].emoji);
        }

    },
    //function to get the stats for an item
    getStats: function(item){
        // traverse the items json file to find the item requested
        for(i in items){
            if(i == item){
                let stats = [items[i].attack,items[i].defence];
                // return the stats id
                return stats;
            }
        }
    },
    //Function to calculate damage done to an enitity
    calculateDamage: function(att, def, hp, percent){
        //Calculate the damage to be dealt
        //Difference of Attackers attack stat and defenders defence stat multiplied by 5
        if(att > def){
            //Calculate the upper and lower bound of damage that use can do
            damageUpper = Math.round((3 + att * 0.5) + 3);
            damageLower = Math.round(((3 + att * 0.5) - 3 > 1) ? (3 + att) - 3 : 1);

            //Determine the dammage the user will do
            attackDamage = (att - def) * this.randomInteger(damageLower, damageUpper);
        } else
            return hp;

        //Calculate attackDamage after percent
        attackDamage = Math.round(attackDamage *= percent);

        //Calculate the health after damage
        //If damage is greater than current health, set hp to 0
        if(attackDamage > hp)
            hp = 0
        else
            hp -= attackDamage;

        return hp;
    }
}