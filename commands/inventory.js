const Discord = require('discord.js');
const {items} = require('../jsons/items.json');

var functions = require('../functions.js');

module.exports={
    name: 'inventory',
    description: "shows the users inventory",
    execute(message){

        //Check if the player mentioned another user
        const player = functions.checkMention(message);

        //Get the users inventory
        let sql = `SELECT * FROM Inventory I WHERE I.id = '${player.id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //Check if the user has an inventory
            if(rows.length < 1){
                message.channel.send(`${player.username} has not started their adventure in Erovar!`)
            } else {

                //Generate an array of the users inventory.
                var inventory = "";
                var consumablesL = "";
                for(i in items){
                    //Only show items that have user has at least one of
                    if(rows[0][i] > 0 && items[i]['type'] === "resource")
                        inventory += `${items[i]['emoji']} ${items[i]['name']} : ${rows[0][i]} \n`;
                    else if(rows[0][i] > 0 && items[i]['type'] === "consumable")
                        consumablesL += `${items[i]['emoji']} ${items[i]['name']} : ${rows[0][i]} \n`;
                }

                //Check if the players inventory is empty and add a message if it is
                if(inventory == "")
                inventory = "Your items is empty :slight_frown:";

                //Check if the players inventory is empty and add a message if it is
                if(consumablesL == "")
                    consumablesL = "Your consumables is empty :slight_frown:";

                //Create the embed to output
                const inventoryEmbed = new Discord.MessageEmbed()
                    .setColor('#0a008c')
                    .setAuthor(player.username + '\'s Inventory', player.avatarURL())
                    .addFields(
                        { name: 'Items', value: inventory, inline: true },
                        { name: 'Consumables', value: consumablesL, inline: true },
                    )
                //Send Embed
                message.channel.send(inventoryEmbed);
            }
        });
    }
}
