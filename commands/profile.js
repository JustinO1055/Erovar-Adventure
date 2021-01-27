const Discord = require('discord.js');

module.exports={
    name: 'profile',
    description: "command to show profile",
    execute(message){

        //Check if the user mentioned someone else, meaning they want to check another users inventory
        if(message.mentions.members.size > 0){
            id = message.mentions.users.first().id;
            username = message.mentions.users.first().username;
        } else {
            id = message.author.id;
            username = message.author.username;
        }

        //Get the users inventory
        let sql = `SELECT * FROM Users WHERE id = '${id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //Check if the user has an inventory
            if(rows.length < 1){
                message.channel.send(`${username} has not started their adventure in Erovar!`)
            } else {
                const User = client.users.cache.get(rows[0].id); // Getting the user by ID.

                //Generate and array of the users profile.
                var profile = `**Level:** \n`;
                profile += `**XP:** ${rows[0].xp}\n`;
                profile += `**Area:** ${rows[0].area}\n`;
                profile += `**Max Area:** ${rows[0].max_area}\n`;
                profile += `**Sword:** ${rows[0].sword}\n`;
                profile += `**Shield:** ${rows[0].shield}\n`;
                profile += `**Armor:** ${rows[0].armor}\n`;
                profile += `**Pickaxe:** ${rows[0].pickaxe}\n`;
                profile += `**Axe:** ${rows[0].axe}`;

                //Create the embed to output
                const profileEmbed = new Discord.MessageEmbed()
                    .setColor('#0a008c')
                    .setAuthor(User.username + '\'s Profile', User.avatarURL())
                    .setDescription(profile)
                //Send Embed
                message.channel.send(profileEmbed);
            }
        });
    }
}
