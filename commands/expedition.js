// to allow for embeds
const Discord = require('discord.js');

// include classes to create monster
const factoryMonster = require('../classes/monsterFactory.js');

//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

module.exports={
    name: 'expedition',
    description: "Used in order for the player to go on a longer mission to fight an enemy. 1 hour cooldown on this command.",
    execute(message, args) {

        // variables for time cooldown
        var seconds = 0;
        var minutes = 30;
        var hours = 0;

        //check to ensure that the user is not on cooldown
        var sqlCooldown = `SELECT C.cd_expedition, U.admin FROM Cooldown C, Users U WHERE U.id = C.id AND C.id = '${message.author.id}'`;
        connection.query(sqlCooldown, (err, rowsCD) =>{
            if(err) throw err;

            // get the last command time
            var last = rowsCD[0]['cd_expedition'];
            // get current time
            var today = new Date();
            // get difference in time from now to last sent
            var diff = Math.abs(today - last);
            // convert the cooldown 
            var cooldown = ((((hours * 60) + minutes) * 60) + seconds)* 1000;

            // if the time is less than the cooldown
            if(diff < cooldown && rowsCD[0].admin != 1){
                // convert to seconds
                var cooldownL = (cooldown - diff)/ 1000;
                var minL = Math.floor(cooldownL / 60);
                var secL = Math.floor(cooldownL % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
                message.reply(`Please wait ${minutes} minutes before sending this command again. You have ${minL}:${secL} left`);
                return;
            // if no longer on cooldown
            // time has passed
            } else if (diff >= cooldown || rowsCD[0].admin == 1){

                // get the users area
                let sql1 = `SELECT area, hp, max_hp, attack, defence, level, xp FROM Users WHERE id = '${message.author.id}'`;
                connection.query(sql1, (err, rows) =>{

                    // create the new monster
                    // returns the object for the monster
                    var monster = factoryMonster.createMonster("expedition", rows[0].area);
                    
                    // call the combat function to initate the expedition battle
                    combat(rows[0], monster, message);

                    // update the cooldown in database
                    var sql2 = `UPDATE Cooldown SET cd_expedition = NOW() WHERE id = '${message.author.id}'`;
                    connection.query(sql2);

                });
            }
        });
    }
}

//Function for combat
async function combat(player, monster, message){

    // prep message to send, could directly send, want it to be sent right before embed
    let encounterMsg = `A wild ${monster.emoji} has appeared!`;
    message.channel.send(encounterMsg);

    //set the stats for the user for the embed
    let userStats = `**HP**: ${player.hp}/${player.max_hp}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`;

    // set the stats for the monster for the embed
    let encounterStats = `**HP**: ${monster.hp}/${monster.hp}\n**Att**: ${monster.attack}\n**Def**: ${monster.defence}`;

    // randomly generate the percents for each of the monsters moves
    let percent = functions.threeRandomInteger();

    //Decalare player moves for readding to embed
    encounterPlayerMoves = { name: "Your Moves:", value: "What are you going to do?\n\`attack\` to recklessly attack the monster.\n\`block\` to block the monsters attack and then attack back.\n\`dodge\` to dodge the monsters attack and then attack back.\n\`run\` a last resort if you cannot beat the monster"};

    // create the embed to send
    const encounterEmbed = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle('Expedition')
    .addFields(
        { name: `${message.author.username}'s Stats:`, value: userStats, inline: true },
        { name: `Wild ${monster.name}'s ${monster.emoji} Stats:`, value: encounterStats, inline: true},
        encounterPlayerMoves,
        { name: `${monster.name}'s Moves:`, value: `What will the enemy do?\n\`${monster.moves[0]}\` (${percent[0]}%)\n\`${monster.moves[1]}\` (${percent[1]}%)\n\`${monster.moves[2]}\` (${percent[2]}%)\n`}
    );

    //Declare variables to track current HP for player and monster
    var playerCurrentHP = player.hp;
    var monsterCurrentHP = monster.hp;

    // set up listening for response
    let filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'attack' || m.content.toLowerCase() == 'block' || m.content.toLowerCase() == 'dodge' || m.content.toLowerCase() == 'run');

    while(playerCurrentHP > 0 && monsterCurrentHP > 0) {
        message.channel.send(encounterEmbed)
        await message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time'] }).then(mes => {
            //Store health for player and monster
            tempHP = [playerCurrentHP, monsterCurrentHP];

            //Convert message to lowercase
            var command = mes.first().content.toLowerCase();

            //Generate random number for what monster move will be used
            var randomNum  = functions.randomInteger(1, 100);

            //Runing value used to calculate monsters move
            var runningValue = 0;

            //Stores the index of tha attack used
            attackIndex = 0;

            //Determines the mosters move
            while(attackIndex < 3){
                runningValue += percent[attackIndex];

                if(randomNum <= runningValue)
                    break;

                attackIndex++;
            }

            //Determine the outome of the turn
            if(command == "run"){
                message.channel.send("You were able to run away.\nYou got nothing from that fight and realize you lost half your HP.");
                monsterCurrentHP = 0;

                // create sql statement
                let sql = `UPDATE Users SET hp = hp / 2 WHERE id = '${message.author.id}'`;
                // query the db
                connection.query(sql);
                return;

            }else if((command == "attack" && attackIndex == 0) || (command == "block" && attackIndex == 1) || (command == "dodge" && attackIndex == 2)){
                //Calculate monsters new hp
                monsterCurrentHP = functions.calculateDamage(player.attack, monster.defence, monsterCurrentHP, 1);

                //Calculate players new hp
                playerCurrentHP = functions.calculateDamage(monster.attack, player.defence, playerCurrentHP, 0.25);
            } else if((command == "block" && attackIndex == 0) || (command == "dodge" && attackIndex == 1) || (command == "attack" && attackIndex == 2)){
                //Calculate monsters new hp
                monsterCurrentHP = functions.calculateDamage(player.attack, monster.defence, monsterCurrentHP, 0.25);

                //Calculate players new hp
                playerCurrentHP = functions.calculateDamage(monster.attack, player.defence, playerCurrentHP, 1);
            } else {
                //Calculate monsters new hp
                monsterCurrentHP = functions.calculateDamage(player.attack, monster.defence, monsterCurrentHP, 0.5);

                //Calculate players new hp
                playerCurrentHP = functions.calculateDamage(monster.attack, player.defence, playerCurrentHP, 0.5);
            }

            //Update the previous turns result
            enounterResult = { name: `Previous Turn Result:`, value: `You used **${command.charAt(0).toUpperCase() + command.slice(1)}** and the ${monster.name} used **${monster.moves[attackIndex]}**\nYou were hit for ${tempHP[0] - playerCurrentHP} HP :hearts: and the ${monster.name} was hit for ${tempHP[1] - monsterCurrentHP} HP :hearts:` };


            //If the player or monster isnt dead, output new health and move values in embed
            if(playerCurrentHP > 0 && monsterCurrentHP > 0) {
                //set the stats for the user for the embed
                userStats = `**HP**: ${playerCurrentHP}/${player.max_hp}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`;
                encounterPlayer = { name: `${message.author.username}'s Stats:`, value: userStats, inline: true };

                // set the stats for the monster for the embed
                encounterStats = `**HP**: ${monsterCurrentHP}/${monster.hp}\n**Att**: ${monster.attack}\n**Def**: ${monster.defence}`;
                encounterMonster = { name: `Wild ${monster.name}'s ${monster.emoji} Stats:`, value: encounterStats, inline: true};

                //Calculate new percents for each of the monsters moves
                percent = functions.threeRandomInteger();

                //Update the monster moves on the embed
                encounterMonsterMove = { name: `${monster.name}'s Moves:`, value: `What will the enemy do?\n\`${monster.moves[0]}\` (${percent[0]}%)\n\`${monster.moves[1]}\` (${percent[1]}%)\n\`${monster.moves[2]}\` (${percent[2]}%)\n`};

                encounter = [enounterResult, encounterPlayer, encounterMonster, encounterPlayerMoves, encounterMonsterMove]

                //Update Embed
                encounterEmbed.spliceFields(0, 5, encounter);

            } else {
                //set the stats for the user for the embed
                userStats = `**HP**: ${playerCurrentHP}/${player.max_hp}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`;
                encounterPlayer = { name: `${message.author.username}'s Stats:`, value: userStats, inline: true };

                // set the stats for the monster for the embed
                encounterStats = `**HP**: ${monsterCurrentHP}/${monster.hp}\n**Att**: ${monster.attack}\n**Def**: ${monster.defence}`;
                encounterMonster = { name: `Wild ${monster.name}'s ${monster.emoji} Stats:`, value: encounterStats, inline: true};

                if(playerCurrentHP == 0){
                    encounterOver = { name: "Fight Over", value: `You lost to the ${monster.name}.`};
                } else {
                    encounterOver = { name: "Fight Over", value: `You beat the ${monster.name}.\nYou got ${monster.xp} XP and ${monster.gold} Gold!`};
                }

                encounter = [enounterResult, encounterPlayer, encounterMonster, encounterOver]

                //Update Embed
                encounterEmbed.spliceFields(0, 5, encounter);

                message.channel.send(encounterEmbed);

                if(playerCurrentHP == 0){
                    functions.playerDeath(message, player.level, player.area);
                } else {
                    functions.battleSuccess(message, player.level, player.xp, monster.xp, playerCurrentHP, monster.gold, null, monster.json);
                }
            }
        })
        //If the user doesnt enter a valid response, monster attacks
        .catch(collected => {
            message.channel.send("You sat in a daze for a while and when you came to your senses you realized that you had to run away.\nYou got nothing from that fight and realize you lost half your HP.");
            monsterCurrentHP = 0;

            // create sql statement
            let sql = `UPDATE Users SET hp = hp / 2 WHERE id = '${message.author.id}'`;
            // query the db
            connection.query(sql);
        });
    }

}