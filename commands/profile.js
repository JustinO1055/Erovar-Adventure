const Discord = require('discord.js');
const {items} = require('../jsons/items.json');

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

                //Generate arraya of the users profile.
                var profileStats = `**Level:** ${rows[0].level}\n`;
                profileStats += `**XP:** ${rows[0].xp}\n`;
                profileStats += `**HP:** ${rows[0].hp}/${rows[0].max_hp}\n`;
                profileStats += `**Attack:** ${rows[0].attack}\n`;
                profileStats += `**Defence:** ${rows[0].defence}`;

                var profileOther = `**Area:** ${rows[0].area}\n`;
                profileOther += `**Max Area:** ${rows[0].max_area}\n`;
                profileOther += `**Gold:** ${rows[0].gold}`;

                var profileEquip = `**Sword:** ${checkEquipment(rows[0].sword)}\n`;
                profileEquip += `**Shield:** ${checkEquipment(rows[0].shield)}\n`;
                //profileEquip += `**Armor:** ${checkEquipment(rows[0].armor)}\n`;
                profileEquip += `**Pickaxe:** ${checkEquipment(rows[0].pickaxe)}\n`;
                profileEquip += `**Axe:** ${checkEquipment(rows[0].axe)}`;

                //Create the embed to output
                const profileEmbed = new Discord.MessageEmbed()
                    .setColor('#0a008c')
                    .setAuthor(User.username + '\'s Profile', User.avatarURL())
                    .addFields(
                        { name: '__Stats:__', value: profileStats, inline: true },
                        { name: '__Other:__', value: profileOther, inline: true },
                        { name: '__Equipment:__', value: profileEquip, inline: true },
                    )
                //Send Embed
                message.channel.send(profileEmbed);
            }
        });
    }
}

//Function used to return string that will be shown in the equipment area in profile
function checkEquipment(item){
    if(item != "NONE"){

        //Split item name by the spaces
        const words = item.split(" ");

        //Capatalize each word
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }

        //Join the words back together
        itemCap = words.join(" ");

        //Return string to show in profile
        return `${items[item]['emoji']} ${itemCap}`

    } else{
        return "None"
    }

}
