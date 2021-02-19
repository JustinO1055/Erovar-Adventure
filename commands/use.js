// holds items for game
const {items} = require('../jsons/items.json');

//Include the js file with functions, that includes the amount function
var functions = require('../functions.js');

module.exports={
    name: 'use',
    description: "Used to use consumable items",
    execute(message, args){

        //Check if the player has supplied an item to use and give a message if they do no use the command correctly
        if(args.length < 1){
            message.channel.send(`${message.author}, the proper use of this command is \`adv use <item>\``);
            return;
        }

        //Parse argument list
        var arguments = functions.parseArguments(args);

        //Declare item to store the item to use
        item = "";

        for(i in items){
            if(i == arguments[0]){
                item = items[i];
                break;
            }
        }

        //Check if the item was a valid item to use
        if(item == ""){
            message.channel.send(`${message.author}, Cannot find the item you are trying to use.`);
            return;
        }

        if(item.type != 'consumable'){
            message.channel.send(`${message.author}, You can only use consumables.`);
            return;
        }

        // get users profile to get inventory
        let sql = `SELECT I.${arguments[0]}, U.hp, U.max_hp FROM Inventory I, Users U WHERE I.id = U.id AND I.id = '${message.author.id}'`;
        connection.query(sql, (err, rows) =>{
            if (err) throw err;

            // check to see if user has enough gold
            // if not enough of the item, print error
            if(rows[0][arguments[0]] < 1){
                message.reply(`You do not have enough ${item.name} ${item.emoji} to use. Check your inventory with \`adv inventory\``);
                return;
            // use the item
            } else if((rows[0]['hp'] >= rows[0]['max_hp']) && arguments[0] == "health_potion"){
                message.channel.send(`${message.author}, you already have full hp!`);
                return;
            } else {

                // use the item
                let sql2 = `UPDATE Users SET ${item.use} WHERE id = '${message.author.id}'`;
                let sql3 = `UPDATE Inventory SET ${arguments[0]} = ${arguments[0]} - 1 WHERE id = '${message.author.id}'`;
                connection.query(sql2);
                connection.query(sql3);

                let outputMsg = `${message.author.username} has used ${item.name} and ${item.msg}.`;
                // print a message to the user
                message.channel.send(outputMsg);
                return;

            }

        });

    }
}