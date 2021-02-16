const {shop} = require('../jsons/items.json');

//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

module.exports={
    name: 'buy',
    description: "Used to buy items from the shop",
    execute(message, args){

        //Check if the player has supplied an item to buy and give a message if they do not use the command correctly
        if(args.length < 1){
            message.channel.send(`${message.author}, the proper use of this command is \`adv buy <item>\``);
            return;
        }

        //Parse argument list
        var arguments = functions.parseArguments(args);

        var cost = "";

        // preform the look up on the item
        for(s in shop){
            if(s == arguments[0])
                //Get item value
                cost = shop[s]['cost'];
        }
        //Check if the user typed a valid item to buy, and if not give a message
        if(typeof cost == 'undefined' || cost == ""){
            message.channel.send(`${message.author}, Cannot find the item you are trying to buy.`);
            return;
        }

        // preform buying the item
        // get the users gold
        let sql1 = `SELECT gold FROM Users WHERE id = '${message.author.id}'`;
        connection.query(sql1, (err, rows) =>{
            if (err) throw err;

            // compute the total value of the items
            let totalCost = cost * arguments[1];

            // if the user does not have enough gold
            if(rows[0]['gold'] < totalCost){
                message.channel.send(`${message.author}, you do not have enough gold to purchase this item. You have ${rows[0]['gold']} gold, total cost for this item is ${totalCost}.`);
            // if the user has enough money, allow the user to buy the item
            } else {
                // prep the two queries
                let sql2 = `UPDATE Users SET gold = gold - ${totalCost} WHERE id = '${message.author.id}'`;
                let sql3 = `UPDATE Inventory SET ${arguments[0]} = ${arguments[0]} + ${arguments[1]} WHERE id = '${message.author.id}'`;

                // query the database
                connection.query(sql2);
                connection.query(sql3);

                // print the message to the user
                message.channel.send(`${arguments[1]} ${shop[arguments[0]]['name']} ${shop[arguments[0]]['emoji']} bought.`);
            }


        });

    }
}