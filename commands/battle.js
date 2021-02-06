// to allow for embeds
const Discord = require('discord.js');

// include the json file that holds all of the monsters names, emoji codes and information
const MONSTERS = require('../jsons/monsters.json');

//Include the js file that contains the resourceDrop class
var monsterStats = require('../classes/monsterStats.js');
var monsterEncounter = require('../classes/monsterEncounter.js');

module.exports={
    name: 'battle',
    description: "Used in order for the player to go on a short mission to fight an enemy. 1 minute cooldown on this command.",
    execute(message, args){

        //TODO: begin with cooldown check. add later after initial testing cuz it will get in our way

        // get the users area
        let sql1 = `SELECT area, hp, max_hp, attack, defence FROM Users WHERE id = '${message.author.id}'`;
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
                    MONSTERS[`area${rows[0].area}`]['battle'][m]['emoji']));
            }

            //Determine which monster is encountered
            // returns as array
            // 0 = name
            // 1 = attack
            // 2 = defence
            // 3 = hp
            // 4 = emoji code
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
                { name: `Wild ${monster[0]}'s ${monster[4]} stats`, value: encounterStats, inline: true}
            );
            
            message.channel.send(encounterEmbed);

        });

    }
}