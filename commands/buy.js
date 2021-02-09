const {shop} = require('../jsons/items.json');

module.exports={
    name: 'buy',
    description: "Used to buy items from the shop",
    execute(message, args){
        //Check if the player has supplied an item to buy and give a message if they do not use the command correctly
        if(args.length < 1){
            message.channel.send(`${message.author}, the proper use of this command is \`adv buy [item]\``);
            return;
        }

        let amount = 1;


        /* NOTE
        * Currently only works with items that are two words long, when additional items get added
        * Will need to update these cases
        */
        // combine the first two arguments 
        let item = args[0].concat(args[1]);

        // if there is an amount provided in args[2], convert to integer
        if(typeof args[2] != 'undefined')
            amount = calcAmount(args[2]);

        // preform the look up on the item
        for(s in shop){
            if(s == item)
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
            let totalCost = cost * amount;

            // if the user does not have enough gold
            if(rows[0]['gold'] < totalCost){
                message.channel.send(`${message.author}, you do not have enough gold to purchase this item. You have ${rows[0]['gold']} gold, total cost for this item is ${totalCost}.`);
            // if the user has enough money, allow the user to buy the item
            } else {
                // prep the two queries
                let sql2 = `UPDATE Users SET gold = gold - ${totalCost} WHERE id = '${message.author.id}'`;
                let sql3 = `UPDATE Inventory SET ${item} = ${item} + ${amount} WHERE id = '${message.author.id}'`;

                // query the database
                connection.query(sql2);
                connection.query(sql3);

                // print the message to the user
                message.channel.send(`${amount} ${shop[item]['name']} ${shop[item]['emoji']} bought.`);
            }


        });

    }
}

function calcAmount(input){
    // regex for finding if the user has valid input
    var regex = /\d+(\.\d+)?[kmb]?$/;

    //test the input based off the regex
    // if its valid, continue to pasre the input.
    if(regex.test(input)){

        // set the multiplier value for the k m b modifier
        var multiplier = 1;

        // figure out if there is a letter
        var isLetter = /[kmb]/i;
        var letter = input.match(isLetter);
        // if letter found, store its value
        if(letter != null){
            // figure out which letter
            // store its multiplier
            switch(letter[0]){
                case 'k':
                    multiplier = 1000;
                    break;
                case 'm':
                    multiplier = 1000000;
                    break;
                case 'b':
                    multiplier = 1000000000;
                    break;
            }
            // remove the k b or m
            input = input.replace(letter[0], '');
        }

        // convert the input to float
        input = parseFloat(input);
        // convert to int after multiplying
        var value = parseInt(input * multiplier);
        return value;

    // otherwise return -1 (error)
    } else {
        return -1;
    }
}