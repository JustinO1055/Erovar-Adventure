// to allow for embeds
const Discord = require('discord.js');

// include the json file that holds all of the monsters names, emoji codes and information
const MONSTERS = require('../jsons/monsters.json');

//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

module.exports={
    name: 'boss',
    description: "Used for fighting the boss of the area in order to unlock the next area",
    execute(message, args) {

        // todo, add support for multiple players to do the same dungeon

        // get the users information
        let sqlInfo = `SELECT area, max_area, level, sword, shield, armor, pickaxe, axe, hp, max_hp, attack, defence FROM Users WHERE id = '${message.author.id}'`;
        connection.query(sqlInfo, (err, rows) =>{
            if (err) throw err;

            // do a switch statement based on max area to get the right dungeon
            switch(rows[0].max_area){
                case 0:{
                    // check to make sure the user is in the area
                    if(rows[0].max_area != rows[0].area){
                        message.channel.send(`${message.author}, you are not in the right area. Make sure you are in your max area to do this dungeon.\nType \`adv help\` for help`);                   
                        return;
                    }
                    
                    // ensure the user has all of the correct requirements.
                    // prep error message for if they do not have the requirements
                    let errorMessage = "";
                    valid = true;
                    // check the users level to be greater than 3
                    if(rows[0].level < 3) {
                        errorMessage += `**Level:** 3 :x:\n`;
                        valid = false;
                    } else {
                        errorMessage += `**Level:** 3 :white_check_mark:\n`;
                    }
                    // make sure user has basic sword
                    if(rows[0].sword != 'basic sword') {
                        errorMessage += `**Sword:** Basic Sword ${functions.getEmoji('basic sword')} :x:\n`;
                        valid = false;
                    } else {
                        errorMessage += `**Sword:** Basic Sword ${functions.getEmoji('basic sword')} :white_check_mark:\n`;
                    }
                    // make sure user has basic shield
                    if(rows[0].shield != 'basic shield') {
                        errorMessage += `**Shield:** Basic Sheild ${functions.getEmoji('basic shield')} :x:\n`;
                        valid = false;
                    } else {
                        errorMessage += `**Shield:** Basic Sheild ${functions.getEmoji('basic shield')} :white_check_mark:\n`;
                    }
                    // make sure user has stone axe
                    if(rows[0].axe != 'stone axe') {
                        errorMessage += `**Axe:** Stone Axe ${functions.getEmoji('stone axe')} :x:\n`;
                        valid = false;
                    } else {
                        errorMessage += `**Axe:** Stone Axe ${functions.getEmoji('stone axe')} :white_check_mark:\n`;
                    }
                    // make sure user has stone pickaxe
                    if(rows[0].pickaxe != 'stone pickaxe') {
                        errorMessage += `**Pickaxe:** Stone Pickaxe ${functions.getEmoji('stone pickaxe')} :x:\n`;
                        valid = false;
                    } else {
                        errorMessage += `**Pickaxe:** Stone Pickaxe ${functions.getEmoji('stone pickaxe')} :white_check_mark:\n`;
                    }

                    // if the user does not meet requirements. send the error
                    if(!valid){
                            // create the embed to send
                            const errorEmbed = new Discord.MessageEmbed()
                            .setColor('#CC0000')
                            .setTitle('Error')
                            .addFields(
                                { name: `Lacking Boss Requirements:`, value: errorMessage},
                            );
                            message.channel.send(errorEmbed);
                            return;
                    }

                    // if the player is prepared, prompt user if they are ready to start the boss fight
                    // create the embed to send
                    const ready = new Discord.MessageEmbed()
                    .setColor('#0A008C')
                    .setTitle('Boss Fight')
                    .addFields(
                        { name: `Description`, value: `Welcome to the first of many boss fights you will encounter throughout your journey through Erovar.\n
                        This is the tutorial boss fight, you will be fighting this boss alone, in the future you might need to team up with fellow adventurers in order to take down the tougher bosses.\n
                        This is a strategy based boss, this boss has a 'tell' before it attacks. You must decipher his tell to defeat him. Each successful attack to the boss will deal some damage, if you attack unsuccessfully, the boss will instead attack you.\n
                        Good luck. Upon defeating the boss, you will be granted access to the greater areas in area 1.`},
                        { name: "Ready", value: `If you are ready, type \`yes\` to begin the fight. If you need more time to prepare, type \`no\` to cancel.`}
                    );

                    let filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no');
                    message.channel.send(ready).then(() => {
                        message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time'] }).then(mes => {
                            var command = mes.first().content.toLowerCase();
                            if (command == 'yes') {
                                boss0(rows[0], message);
                            } else if (command == 'no') {
                                message.channel.send("Boss fight canceled");
                            }
                            return;
                        })
                        .catch(collected => {
                            message.channel.send('Timeout');
                        });
                    });

                    break;
                }
            }
        
        });

    }
}

async function boss0(player, message){

    // store boss into variable for easier access
    var boss;
    for(b in MONSTERS['area0']['boss']){
        boss = MONSTERS['area0']['boss'][b];        
    }

    //set the stats for the user for the embed
    let userStats = `**HP**: ${player.hp}/${player.max_hp}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`;

        // set the stats for the monster for the embed
    let bossStats = `**HP**: ${boss.hp}/${boss.hp}\n`;

    //Decalare player moves for readding to embed
    let bossPlayerMoves = { name: "Your Moves:", value: "What are you going to do?\n\`attack\` to recklessly attack the monster.\n\`block\` to block the monsters attack and then attack back.\n\`dodge\` to dodge the monsters attack and then attack back.\n\`cry\` to do a big cry."};
    

    // create the embed to send
    const bossEmbed = new Discord.MessageEmbed()
    .setColor('#0A008C')
    .setTitle('Boss Fight')
    .addFields(
        { name: `${message.author.username}'s Stats:`, value: userStats, inline: true },
        { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: bossStats, inline: true},
        bossPlayerMoves
    );

    message.channel.send(bossEmbed);

}