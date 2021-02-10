// to allow for embeds
const Discord = require('discord.js');

// include the json file that holds all of the monsters names, emoji codes and information
const MONSTERS = require('../jsons/monsters.json');

//Include the js file that contains the resourceDrop class
var monsterStats = require('../classes/monsterStats.js');
var monsterEncounter = require('../classes/monsterEncounter.js');

//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

module.exports={
    name: 'battle',
    description: "Used in order for the player to go on a short mission to fight an enemy. 1 minute cooldown on this command.",
    execute(message, args) {

        //TODO: begin with cooldown check. add later after initial testing cuz it will get in our way

        // get the users area
        let sql1 = `SELECT area, hp, max_hp, attack, defence, level, xp FROM Users WHERE id = '${message.author.id}'`;
        connection.query(sql1, (err, rows) =>{

            // create a new monster encounter table
            let monsterEncounterTable = new monsterEncounter;

            // Go through the monstors list for the users area under the battle section.
            for(m in MONSTERS[`area${rows[0].area}`]['battle']){
                // add the information for that monster to the encounter table.
                monsterEncounterTable.addMonster(new monsterStats(
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['name'],
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['encounter'],
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['minattack'],
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['maxattack'],
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['mindefence'],
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['maxdefence'],
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['minhp'],
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['maxhp'],
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['minxp'],
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['maxxp'],
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['emoji']));
            }

            //Determine which monster is encountered
            // returns as array
            // 0 = name
            // 1 = attack
            // 2 = defence
            // 3 = hp
            // 4 = emoji code
            // 5 = xp for winning
            // 6 = gold for winning
            let monster = monsterEncounterTable.determineHit();
            // prep message to send, could directly send, want it to be sent right before embed
            let encounterMsg = `A wild ${monster[4]} has appeared!`;
            message.channel.send(encounterMsg);

            //set the stats for the user for the embed
            let userStats = `**HP**: ${rows[0].hp}/${rows[0].max_hp}\n**Att**: ${rows[0].attack}\n**Def**: ${rows[0].defence}`;

            // set the stats for the monster for the embed
            let encounterStats = `**HP**: ${monster[3]}/${monster[3]}\n**Att**: ${monster[1]}\n**Def**: ${monster[2]}`;
            
            // create the embed to send
            const encounterEmbed = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Battle')
            .addFields(
                { name: `${message.author.username}'s Stats:`, value: userStats, inline: true },
                { name: `Wild ${monster[0]}'s ${monster[4]} Stats:`, value: encounterStats, inline: true},
                { name: "Action:", value: "What are you going to do?\n\`fight\` to fight the monster.\n\`run\` to run away from the monster."}
            );
            
            // set up listening for response
            let filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'fight' || m.content.toLowerCase() == 'run');
            message.channel.send(encounterEmbed).then(() => {
                message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time'] })
                    .then(mes => {
                        //Convert message to lowercase
                        var command = mes.first().content.toLowerCase();

                        if(command == "fight"){
                            //Calculate Monsters new hp
                            monsterCurrentHp = functions.calculateDamage(rows[0].attack, monster[2], monster[3], 1);

                            //Update the Monsters stat on the embed
                            encounterStats = `**HP**: ${monsterCurrentHp}/${monster[3]}\n**Att**: ${monster[1]}\n**Def**: ${monster[2]}`;
                            encounterMonster = { name: `Wild ${monster[0]}'s ${monster[4]} Stats:`, value: encounterStats, inline: true}

                            //Calculate players new hp
                            playerCurrentHp = functions.calculateDamage(monster[1], rows[0].defence, rows[0].hp, 1);

                            //Update the Players stat on the embed
                            userStats = `**HP**: ${playerCurrentHp}/${rows[0].max_hp}\n**Att**: ${rows[0].attack}\n**Def**: ${rows[0].defence}`;
                            encounterPlayer = { name: `${message.author.username}'s Stats:`, value: userStats, inline: true }

                            //Determine result
                            if(playerCurrentHp == 0){
                                result = `The wild ${monster[0]} ${monster[4]} has beat you.`
                            } else if(monsterCurrentHp == 0){
                                result = `You beat the wild ${monster[0]} ${monster[4]}!\nYou got ${monster[5]} xp from the battle!`
                            } else{
                                result = `You were unable to beat the wild ${monster[0]} ${monster[4]} and it got away.`
                                sqlEncounterResult = `UPDATE Users SET hp = ${playerCurrentHp} WHERE id = '${message.author.id}'`;
                                connection.query(sqlEncounterResult);
                            }

                            //Create result to add to embed
                            encounterResult = { name: "Result:", value: result}

                            //Store all updated values to add to embed
                            encounter = [encounterPlayer, encounterMonster, encounterResult];

                            //Update Embed
                            encounterEmbed.spliceFields(0, 3, encounter);

                            //Send new embed
                            message.channel.send(encounterEmbed);

                            //If the player died, call playerDeath function
                            if(playerCurrentHp == 0)
                                functions.playerDeath(message);
                            else if(monsterCurrentHp == 0)
                                functions.battleSuccess(message, rows[0].level, rows[0].xp, monster[5], playerCurrentHp, monster[6]);
                            
                        } else {
                            if(!failEscape(monster[0], monster[4], message.author.id, message.channel.id))
                                message.channel.send("AHHHHHHHHH IM SCARED");
                        }


                    })
                    //If the user doesnt enter a valid response, monster attacks
                    .catch(collected => {
                        if(!failEscape(monster[0], monster[4], message.author.id, message.channel.id))
                            message.channel.send(`Monster does a big attack`);
                    });
                });

        });

    }
}

// function to decide if the user can successfully get away
function failEscape(monsterName, monsterEmoji, author, channelID){

    // compute a random number between 1 and 10
    // if it is between 1 and 10, escape failed, and user loses half of their HP
    if(functions.randomInteger(1,10) <= 1){

        // create sql statement
        let sql = `UPDATE Users SET hp = hp / 2 WHERE id = '${author}'`;
        // query the db
        connection.query(sql);

        // print message 
        const channel = client.channels.cache.get(channelID);
        channel.send(`As you were running away, the ${monsterEmoji} got an attack in doing half of your hp!.`);
        
        return true;

    }

    return false;

};