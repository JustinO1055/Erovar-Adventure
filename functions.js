// include the items json file
const {items} = require('./jsons/items.json');

module.exports = {
    playerDeath: function(message, currentLevel, area) {
        //Check to see if the player is in area 0
        if(area != 0){
            //Output a message that the user died
            message.channel.send("You died. Your XP has been reset back to 0 for your current level.")

            //Find the xp values for the user to level
            xpValues = this.xpCurrentNext(currentLevel);

            //Update the db
            sql = `UPDATE Users SET hp = max_hp, xp = ${xpValues[0]} WHERE id = ${message.author.id}`;
            connection.query(sql);
        } else {
            //Output a message that the user died
            message.channel.send("You feel your life fade before you. At the last second a magical healing fairy saves your life.\nThe fairy tells you to be more careful as she wont help you after you leave area 0.");

            //Heal the player
            sql = `UPDATE Users SET hp = max_hp WHERE id = ${message.author.id}`;
            connection.query(sql);
        }
    },
    xpCurrentNext: function(level) {
        //Get the xp values for the players current level and the next level
        var xpCurrent = Math.round(4408417000 + (109.1345 - 4408417000)/(1 + Math.pow(((level- 1)/457.4632),3.390761)));
        var xpNext = Math.round(4408417000 + (109.1345 - 4408417000)/(1 + Math.pow((level/457.4632),3.390761)));

        return [xpCurrent, xpNext];
    },
    battleSuccess: function(message, currentLevel, xpCurrent, xpObtained, hp, gold, drop) {
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

        // if there is a drop, add it to the database
        if(typeof(drop) != 'undefined' || drop != null){
            sql2 = `UPDATE Inventory SET ${drop} = ${drop} + 1 WHERE id = ${message.author.id}`;
            connection.query(sql2);
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
    //Function to calculate damage done to an entity
    calculateDamage: function(att, def, hp, percent){
        //Calculate the damage to be dealt
        //Difference of Attackers attack stat and defenders defence stat multiplied by 5
        if(att > def){
            //Calculate the upper and lower bound of damage that use can do
            damageUpper = Math.round((3 + att * 0.5) + 3);
            damageLower = Math.round(((3 + att * 0.5) - 3 > 1) ? (3 + att) - 3 : 1);

            //Determine the damage the user will do
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
    },
    // function to decide if the user can successfully get away
    failEscape: function(monsterEmoji, author, channelID){

        //Get channel
        const channel = client.channels.cache.get(channelID);

        // compute a random number between 1 and 10
        // if it is between 1 and 10, escape failed, and user loses half of their HP
        if(this.randomInteger(1,10) <= 1){

            // create sql statement
            let sql = `UPDATE Users SET hp = hp / 2 WHERE id = '${author}'`;
            // query the db
            connection.query(sql);

            // print message 
            channel.send(`As you were running away, the ${monsterEmoji} got an attack in doing half of your hp!.`);

        } else {
            // print message 
            channel.send(`You were able to run away successfully.`);
        }
    },
    //Function to capitalize the first letter of a string
    capFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    //Function to return players current progress to a skill level up
    skillLevel: function(totalXP){
        xp = totalXP;
        level = 1;
        graphic = "";

        //Keep subtracting 500 to get players current progress to next level
        while (xp > 500){
            level++;
            xp -= 500;
        }

        //Generate graphic for current progress
        for(i = 0; i < 500; i += 50){
            if(xp > i)
                graphic += "▰";
            else
                graphic += "▱";
        }

        return [level, xp, graphic];
    }
}