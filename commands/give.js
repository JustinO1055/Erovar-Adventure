// holds items for game
const {items} = require('../jsons/items.json');

//Include the js file with functions, that includes the amount function
var functions = require('../functions.js');

module.exports={
    name: 'give',
    description: "Used to give another player items or gold)",
    execute(message, args){

        //Check if the player has supplied an item to give and give a message if they do no use the command correctly
        if(args.length < 1){
            message.channel.send(`${message.author}, the proper use of this command is \`adv give <@person> <item> [quantity]\``);
            return;
        }

        // get id of first argument
        // if it is not a person. print error message
        try{
            var reciever = message.mentions.users.first();
            var recieverId = reciever.id;
            var recieverUsername = reciever.username;
        } catch(err) {
            message.reply(`No user selected to give items to. The proper use of this command is \`adv give <@person> <item> [quantity]\``);
            return;
        }
        // make sure the first argument is the user
        let regex = /^<@!?(\d+)>$/;
        if(!regex.test(args[0])){
            message.reply(`Invalid order for arguments. The proper use of this command is \`adv give <@person> <item> [quantity]\``);
            return;
        }

        // remove the id from args list
        args.shift();

        //Parse argument list
        var arguments = functions.parseArguments(args);

        //Declare item to store the item to give
        item = "";

        //Find the recipe for the item the player is trying to give
        if(arguments[0] != "gold"){
            for(i in items){
                if(i == arguments[0]){
                    item = items[i];
                    break;
                }
            }
        // if its gold, store value as gold
        } else if (arguments[0] === "gold"){
            item = "gold";
        }


        //Check if the item was a valid item to give
        if(item == ""){
            message.channel.send(`${message.author}, Cannot find the item you are trying to give.`);
            return;
        }

        if(item.type != 'resource' && item != "gold"){
            message.channel.send(`${message.author}, You can only give resources to another player.`);
            return;
        }
        
        // if the user is trying to give gold
        if(item == "gold"){

            // get users profile to get gold
            let sql = `SELECT gold FROM Users WHERE id = '${message.author.id}'`;
            connection.query(sql, (err, rows) =>{
                if (err) throw err;

                // check to see if user has enough gold
                // if not enough gold, print error
                if(rows[0].gold < arguments[1]){
                    message.reply(`You do not have enough gold to give. Check your gold with \`adv profile\``);
                    return;
                // give the gold
                } else {

                    // give the gold to the other user
                    sql2 = `UPDATE Users SET gold = gold + ${arguments[1]} WHERE id = '${recieverId}'`;
                    sql3 = `UPDATE Users SET gold = gold - ${arguments[1]} WHERE id = '${message.author.id}'`;
                    connection.query(sql2);
                    connection.query(sql3);

                    // print a message to the user
                    message.channel.send(`${message.author.username} has given ${arguments[1]} gold to ${recieverUsername}.`);
                    return;

                }

            });

        // if its an item
        } else {

            // get users profile to get inventory
            let sql = `SELECT ${arguments[0]} FROM Inventory WHERE id = '${message.author.id}'`;
            connection.query(sql, (err, rows) =>{
                if (err) throw err;

                // check to see if user has enough gold
                // if not enough of the item, print error
                if(rows[0][arguments[0]] < arguments[1]){
                    message.reply(`You do not have enough ${item.name} ${item.emoji} to give. Check your inventory with \`adv inventory\``);
                    return;
                // give the gold
                } else {

                    // give the item to the other user
                    sql2 = `UPDATE Inventory SET ${arguments[0]} = ${arguments[0]} + ${arguments[1]} WHERE id = '${recieverId}'`;
                    sql3 = `UPDATE Inventory SET ${arguments[0]} = ${arguments[0]} - ${arguments[1]} WHERE id = '${message.author.id}'`;
                    connection.query(sql2);
                    connection.query(sql3);

                    let outputMsg = `${message.author.username} has given ${arguments[1]} ${item.name}`
                    if(arguments[1] > 1)
                        outputMsg += `s`;
                        
                    outputMsg += `  ${item.emoji} to ${recieverUsername}.`;

                    // print a message to the user
                    message.channel.send(outputMsg);
                    return;

                }

            });

        }

    }
}