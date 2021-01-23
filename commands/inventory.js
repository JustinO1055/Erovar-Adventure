const Discord = require('discord.js');
const {items} = require('../items.json');

module.exports={
    name: 'inventory',
    description: "inventory",
    execute(message){

        //Check if the user mentioned someone else, meaning they want to check another users inventory
        if(message.mentions.members.size > 0){
            id = message.mentions.users.first().id;
        } else {
            id = message.author.id;
        }

        //Get the users inventory
        let sql = `SELECT * FROM Inventory WHERE id = '${id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //Check if the user has an inventory
            if(rows.length < 1){
                message.channel.send("You better start the journey first. Type 'Adv Start'")
            } else {
                const User = client.users.cache.get(rows[0].id); // Getting the user by ID.

                //Generate and array of the users inventory.
                var messy = "";
                for(i in items){
                    //Only show items that have user has at least one of
                    if(rows[0][items[i]['name']] > 0)
                        messy += `${items[i]['emoji']} ${items[i]['name']} : ${rows[0][items[i]['name']]} \n`;
                }

                //Create the embed to output
                const inventoryEmbed = new Discord.MessageEmbed()
                    .setColor('#0a008c')
                    .setAuthor(User.username + '\'s Inventory', User.avatarURL())
                    .addFields(
                        { name: 'items', value: messy},
                    )
                //Send Embed
                message.channel.send(inventoryEmbed);
            }
        });
    }
}
