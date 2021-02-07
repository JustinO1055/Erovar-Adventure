const Discord = require('discord.js');
const {items, consumables} = require('../jsons/items.json');

module.exports={
    name: 'inventory',
    description: "shows the users inventory",
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
        let sql = `SELECT * FROM Inventory I WHERE I.id = '${id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //Check if the user has an inventory
            if(rows.length < 1){
                message.channel.send(`${username} has not started their adventure in Erovar!`)
            } else {
                const User = client.users.cache.get(rows[0].id); // Getting the user by ID.

                //Generate an array of the users inventory.
                var intentory = "";
                for(i in items){
                    //Only show items that have user has at least one of
                    if(rows[0][items[i]['name']] > 0)
                        intentory += `${items[i]['emoji']} ${items[i]['name']} : ${rows[0][items[i]['name']]} \n`;
                }

                //Check if the players inventory is empty and add a message if it is
                if(intentory == "")
                    intentory = "Your items is empty :slight_frown:";

                //Generate an array of the users inventory.
                var consumablesL = "";
                for(c in consumables){
                    //Only show items that have user has at least one of
                    if(rows[0][c] > 0)
                        consumablesL += `${consumables[c]['emoji']} ${consumables[c]['name']} : ${rows[0][c]} \n`;
                }

                //Check if the players inventory is empty and add a message if it is
                if(consumablesL == "")
                    consumablesL = "Your consumables is empty :slight_frown:";

                //Create the embed to output
                const inventoryEmbed = new Discord.MessageEmbed()
                    .setColor('#0a008c')
                    .setAuthor(User.username + '\'s Inventory', User.avatarURL())
                    .addFields(
                        { name: 'Items', value: intentory, inline: true },
                        { name: 'Consumables', value: consumablesL, inline: true },
                    )
                //Send Embed
                message.channel.send(inventoryEmbed);
            }
        });
    }
}
