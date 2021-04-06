const Discord = require('discord.js');
const {commands} = require('../jsons/cooldown.json');

var functions = require('../functions.js');

module.exports={
    name: 'cooldown',
    description: "Show current cooldowns",
    execute(message, args){

        //Check if the player mentioned another user
        const player = functions.checkMention(message);

        //Get the users cooldowns
        let sql = `SELECT * FROM Cooldown WHERE id = '${player.id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //Declare output message
            msg = "";

            //Check if the user has started their adventure
            if(rows.length < 1){
                message.channel.send(`${player.username} has not started their adventure in Erovar!`)
            } else {

                for (cdT in commands) {
                    msg += `**----- ${cdT} -----**\n`;
                    for(cd in commands[cdT]){
                        // get the last command time
                        var last = rows[0][commands[cdT][cd]['name']];
                        // get current time
                        var today = new Date();
                        // get difference in time from now to last sent and subract the cooldown of the command by that
                        var diff = commands[cdT][cd]['cooldown'] * 60000 - (today - last);
                        
                        //If message is not on cooldown still, put message for how much time is left.
                        if(diff >= 0){
                            // do a check to see if it is greater than an hour cooldown, if it is, display how many hours
                            if(commands[cdT][cd]['cooldown'] >= 60){
                                msg += `:clock1: --- ${commands[cdT][cd]['message']} **${msToHoursandMinutesandSeconds(diff)}**\n`;                            
                            // otherwise only show minutes/ seconds
                            } else {
                                msg += `:clock1: --- ${commands[cdT][cd]['message']} **${msToMinutesandSeconds(diff)}**\n`;
                            }
                        } else{
                            msg += `:white_check_mark: --- ${commands[cdT][cd]['message']}\n`;
                        }
                    }
                    msg += `------------------------------------\n`;
                }
                //Create the embed to output
                const cooldownEmbed = new Discord.MessageEmbed()
                    .setColor('#0a008c')
                    .setAuthor(player.username + '\'s Cooldowns', player.avatarURL())
                    .setDescription(msg)

                //Send Embed
                message.channel.send(cooldownEmbed);
            }
        });
    }
}

// functions to convert time
function msToMinutesandSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (seconds == 60 ? (minutes+1) + "m 0s" : minutes + "m " + seconds + "s");
};

function msToHoursandMinutesandSeconds(millis) {
    var hours = Math.floor(millis / 3600000)
    var minutes = Math.floor((millis % 3600000) / 60000);
    var seconds = ((millis % 60000) % 60000 / 1000).toFixed(0);
    return (hours + "h " + minutes + "m " + seconds + "s");
};