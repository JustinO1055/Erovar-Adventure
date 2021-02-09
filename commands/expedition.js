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
    name: 'expedition',
    description: "Used in order for the player to go on a longer mission to fight an enemy. 1 hour cooldown on this command.",
    execute(message, args) {

        //TODO: begin with cooldown check. add later after initial testing cuz it will get in our way

        // get the users area
        let sql1 = `SELECT area, hp, max_hp, attack, defence, level, xp FROM Users WHERE id = '${message.author.id}'`;
        connection.query(sql1, (err, rows) =>{

            // create a new monster encounter table
            let monsterEncounterTable = new monsterEncounter;

            // Go through the monstors list for the users area under the battle section.
            for(m in MONSTERS[`area${rows[0].area}`]['expedition']){
                // add the information for that monster to the encounter table.
                monsterEncounterTable.addMonster(new monsterStats(
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['name'],
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['encounter'],
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['minattack'],
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['maxattack'],
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['mindefence'],
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['maxdefence'],
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['minhp'],
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['maxhp'],
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['minxp'],
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['maxxp'],
                    MONSTERS[`area${rows[0].area}`]['expedition'][m]['emoji']));
            }

            //Determine which monster is encountered
            // returns as array
            // 0 = name
            // 1 = attack
            // 2 = defence
            // 3 = hp
            // 4 = emoji code
            // 5 = xp for winning
            let monster = monsterEncounterTable.determineHit();

            combat(rows[0], monster, message);

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

//Function for combat
async function combat(player, monster, message){

    // prep message to send, could directly send, want it to be sent right before embed
    let encounterMsg = `A wild ${monster[4]} has appeared!`;
    message.channel.send(encounterMsg);

    //set the stats for the user for the embed
    let userStats = `**HP**: ${player.hp}/${player.max_hp}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`;

    // set the stats for the monster for the embed
    let encounterStats = `**HP**: ${monster[3]}/${monster[3]}\n**Att**: ${monster[1]}\n**Def**: ${monster[2]}`;
    
    // create the embed to send
    const encounterEmbed = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle('Battle')
    .addFields(
        { name: `${message.author.username}'s Stats:`, value: userStats, inline: true },
        { name: `Wild ${monster[0]}'s ${monster[4]} Stats:`, value: encounterStats, inline: true},
        { name: "Action:", value: "What are you going to do?\n\`attack\` to attack the monster.\n\`block\` to block the monsters attack.\n\`dodge\` to dodge the monsters attack."}
    );

    //Declare variables to track current HP for player and monster
    var playerCurrentHP = player.hp;
    var monsterCurrentHP = monster[3];

    // set up listening for response
    let filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'attack' || m.content.toLowerCase() == 'block' || m.content.toLowerCase() == 'dodge');

    while(playerCurrentHP > 0 && monsterCurrentHP > 0) {
        message.channel.send(encounterEmbed)
        await message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time'] }).then(mes => {
            //Convert message to lowercase
            var command = mes.first().content.toLowerCase();

            if(command == "attack"){
                message.channel.send(`You do a big attack`);
            } else if(command == "block"){
                message.channel.send(`You do a big block`);
            } else {
                message.channel.send(`You do a big dodge`);
            }
        })
        //If the user doesnt enter a valid response, monster attacks
        .catch(collected => {
            if(!failEscape(monster[0], monster[4], message.author.id, message.channel.id))
                message.channel.send(`Monster does a big attack`);
        });
    }

}