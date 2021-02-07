const Discord = require('discord.js');
const {commands} = require('../jsons/cooldown.json');

module.exports={
    name: 'cooldown',
    description: "Show current cooldowns",
    execute(message, args){
        //Check if the user mentioned someone else, meaning they want to check another users cooldowns
        if(message.mentions.members.size > 0){
            user = message.mentions.users.first();
        } else {
            user = message.author;
        }

        //Get the users cooldowns
        let sql = `SELECT * FROM Cooldown WHERE id = '${user.id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //Declare output message
            msg = "";

            //Check if the user has started their adventure
            if(rows.length < 1){
                message.channel.send(`${user.username} has not started their adventure in Erovar!`)
            } else {
                for (cd in commands) {

                    // get the last command time
                    var last = rows[0][commands[cd]['name']];
                    // get current time
                    var today = new Date();
                    // get difference in time from now to last sent and subract the cooldown of the command by that
                    var diff = commands[cd]['cooldown'] * 60000 - (today - last);

                    console.log([commands[cd]['name']]);
                    
                    //If message is not on cooldown still, put message for how much time is left.
                    if(diff >= 0){
                        // do a check to see if it is greater than an hour cooldown, if it is, display how many hours
                        if(commands[cd]['cooldown'] >= 60){
                            msg += `:clock1: --- \`${commands[cd]['message']}\` **${msToHoursandMinutesandSeconds(diff)}**\n`;                            
                        // otherwise only show minutes/ seconds
                        } else {
                            msg += `:clock1: --- \`${commands[cd]['message']}\` **${msToMinutesandSeconds(diff)}**\n`;
                        }
                    } else{
                        msg += `:white_check_mark: --- \`${commands[cd]['message']}\`\n`;
                    }
                }
                //Create the embed to output
                const cooldownEmbed = new Discord.MessageEmbed()
                    .setColor('#0a008c')
                    .setAuthor(user.username + '\'s Cooldowns', user.avatarURL())
                    .setDescription(msg)

                //Send Embed
                message.channel.send(cooldownEmbed);
            }
        });
    }
}

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