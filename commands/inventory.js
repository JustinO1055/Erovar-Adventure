const Discord = require('discord.js');
const {inv, invE} = require('../items.json');

module.exports={
    name: 'inventory',
    description: "inventory",
    execute(message){
        var id;

        if(message.mentions.members.size > 0){
            id = message.mentions.users.first().id;
        } else {
            id = message.author.id;
        }

        let sql = `SELECT * FROM Inventory WHERE id = '${id}'`;

        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            if(rows.length < 1){
                message.channel.send("You better start the journey first you pepeg.")
            } else {
                const User = client.users.cache.get(rows[0].id); // Getting the user by ID.
                var messy = "";
                for (let i = 0; i < inv.length; i++) {
                    messy += invE[i] + " " + inv[i] + ": " + rows[0][inv[i]] + "\n";
                }

                const inventoryEmbed = new Discord.MessageEmbed()
                    .setColor('#e3750e')
                    .setAuthor(User.username + '\'s Inventory', User.avatarURL())
                    .addFields(
                        { name: 'items', value: messy},
                    )
                message.channel.send(inventoryEmbed);
            }
        });
    }
}
