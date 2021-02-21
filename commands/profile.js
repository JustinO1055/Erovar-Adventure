const Discord = require('discord.js');
const {items} = require('../jsons/items.json');

var functions = require('../functions.js');

module.exports={
    name: 'profile',
    description: "command to show profile",
    execute(message){

        //Check if the player mentioned another user
        const player = functions.checkMention(message);

        //Get the users inventory
        let sql = `SELECT * FROM Users WHERE id = '${player.id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //Check if the user has an inventory
            if(rows.length < 1){
                message.channel.send(`${player.username} has not started their adventure in Erovar!`)
            } else {

                //Get players Level progress
                playerXP = functions.xpCurrentNext(rows[0].level);
                //Generate arrays of the users profile.
                var profileStats = `**Level:** ${rows[0].level}\n`;
                profileStats += `**XP:** ${rows[0].xp - playerXP[0]}/${playerXP[1] - playerXP[0]}\n`;
                profileStats += `**HP:** ${rows[0].hp}/${rows[0].max_hp}\n`;
                profileStats += `**Attack:** ${rows[0].attack}\n`;
                profileStats += `**Defence:** ${rows[0].defence}`;

                var profileOther = `**Area:** ${rows[0].area}\n`;
                profileOther += `**Max Area:** ${rows[0].max_area}\n`;
                profileOther += `**Gold:** ${rows[0].gold}`;

                var profileEquip = `**Sword:** ${checkEquipment(rows[0].sword)}\n`;
                profileEquip += `**Shield:** ${checkEquipment(rows[0].shield)}\n`;
                profileEquip += `**Armor:** ${checkEquipment(rows[0].armor)}\n`;
                profileEquip += `**Pickaxe:** ${checkEquipment(rows[0].pickaxe)}\n`;
                profileEquip += `**Axe:** ${checkEquipment(rows[0].axe)}`;

                //Create the embed to output
                const profileEmbed = new Discord.MessageEmbed()
                    .setColor('#0a008c')
                    .setAuthor(player.username + '\'s Profile', player.avatarURL())
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
        const words = item.split("_");

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
