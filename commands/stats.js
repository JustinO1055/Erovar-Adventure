// to allow for embeds
const Discord = require('discord.js');

// include the json file that holds all of the items names and emoji codes
const {items} = require('../jsons/items.json');

// include the json file that holds all of the monsters names, emoji codes and information
const MONSTERS = require('../jsons/monsters.json');

//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');
const { createConnection } = require('net');

module.exports={
    name: 'stats',
    description: "Used for the player to see how many monsters they have killed or drops they have obtained.",
    execute(message, args) {

        //Check if the player mentioned another user
        const player = functions.checkMention(message);

        // if another player mentioned, remove from args
        if(player.id != message.author.id){
            args.shift();
        }

        // if args[0] is not monster or drops. print generic stats
        if(args[0] != 'monster' && args[0] != 'drops')
            args[0] = null, args[1] = null;

        // set up the base embed.
        const statsEmbed = new Discord.MessageEmbed()
            .setColor('#0a008c')
            .setAuthor(player.username + '\'s Drop Stats', player.avatarURL());

        // get the users stats from db
        let sql = `SELECT * FROM Stats WHERE id = '${player.id}'`;
        connection.query(sql, (err, rows) => {
            if (err) throw err;

            var monsterStatsMsg = "";

            if(args[0] == 'monster' || args[0] == null){
                // if they provide an area, show stats for that area
                if(args[1] != null){

                    // write the area at the top
                    monsterStatsMsg += `--Area ${args[1]}--\n`
                    // Go through the monsters list for the users area
                    for(t in MONSTERS[`area${args[1]}`]){
                        if(t != 'boss'){
                            monsterStatsMsg += `**${functions.capFirstLetter(t)}**\n`;
                            // go through each type of monster
                            for(m in MONSTERS[`area${args[1]}`][t]){
                                monsterStatsMsg += `**${MONSTERS[`area${args[1]}`][t][m]['name']}** ${MONSTERS[`area${args[1]}`][t][m]['emoji']}: ${rows[0][m]} \n`;
                            }
                            // at the end of each area add new line
                            monsterStatsMsg += `\n`;
                        }
                    }

                // show all stats
                } else {
                    // go through each area
                    for(a in MONSTERS){
                        // write the area at the top.
                        // need to split the area and number by a space and capitalize
                        monsterStatsMsg += `--${functions.capFirstLetter(addSpace(a))} Stats--\n`
                        // Go through the monsters list for the users area
                        for(t in MONSTERS[a]){
                            if(t != 'boss'){
                                monsterStatsMsg += `**${functions.capFirstLetter(t)} Stats**\n`;
                                // go through each type of monster
                                for(m in MONSTERS[a][t]){
                                    monsterStatsMsg += `**${MONSTERS[a][t][m]['name']}** ${MONSTERS[a][t][m]['emoji']}: ${rows[0][m]} \n`;
                                }
                                // at the end of each area add new line
                                monsterStatsMsg += `\n`;
                            }
                        }
                    }
                }
                // add the message to the embed
                statsEmbed.addFields({ name: "Monster Kill Stats", value: monsterStatsMsg, inline: true });
            }

            if(args[0] == 'drops' || args[0] == null){
                var monsterDropsMsg = '';
                // go through the items list
                for (i in items){
                    if (items[i]['droppable'] == true && items[i]['droppable'] != null){
                        monsterDropsMsg += `**${items[i]['name']}** ${items[i]['emoji']}: ${rows[0][i]} \n`;
                    }
                }
                // add the message to the embed
                statsEmbed.addFields({ name: "Monster Drop Stats", value: monsterDropsMsg, inline: true });
            }

            // print the embed
            message.channel.send(statsEmbed);
        });

    }
}

function addSpace(str){

    var checkDigit = /[^0-9](?=[0-9])/g; 
    return (str.replace(checkDigit, '$& '));

}