const Discord = require('discord.js');
const {commands} = require('../jsons/cooldown.json');

module.exports={
    name: 'ready',
    description: "Show commands that are ready to be used",
    execute(message, args){
        //Check if the user mentioned someone else, meaning they want to check another users ready commands
        if(message.mentions.members.size > 0){
            user = message.mentions.users.first();
        } else {
            user = message.author;
        }

        //Get the users ready commands
        let sql = `SELECT * FROM Cooldown WHERE id = '${user.id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //Declare output message
            msg = "";
            
            // have variable to check if any are set
            var ready = false;

            //Check if the user has started their adventure
            if(rows.length < 1){
                message.channel.send(`${user.username} has not started their adventure in Erovar!`)
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
                        if(diff < 0){
                            msg += `:white_check_mark: --- ${commands[cdT][cd]['message']}\n`;
                            ready = true;
                        }
                    }
                    msg += `------------------------------------\n`;
                }

                if(!ready){
                    msg = "All commands are currently on cooldown.";
                }
                //Create the embed to output
                const cooldownEmbed = new Discord.MessageEmbed()
                    .setColor('#0a008c')
                    .setAuthor(user.username + '\'s Ready   ', user.avatarURL())
                    .setDescription(msg)

                //Send Embed
                message.channel.send(cooldownEmbed);
            }
        });
    }
}