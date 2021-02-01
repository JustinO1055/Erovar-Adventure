const {items} = require('../jsons/items.json');

module.exports={
    name: 'sell',
    description: "Used to sell equipment and items",
    execute(message, args){
        //Check if the player has supplied an item to sell and give a message if they do no use the command correctly
        if(args.length < 1){
            message.channel.send(`${message.author}, the proper use of this command is \`adv sell [item]\``);
            return;
        }

        //Set euqipment to false by default
        equipment = false;
        amount = 1;

        // test the second argument, see if it is equipment
        if(args[1] === "sword" || args[1] === "shield" || args[1] === "armor" || args[1] === "pickaxe" || args[1] === "axe"){
            // combine the args into one string
            args[0] = args[0].concat(' ', args[1]);
            equipment = true;
        } else { 
            if(typeof args[1] != 'undefined')
                amount = calcAmount(args[1]);
        }

        //Check to ensure the player supplied a valid item and get the items value
        for(i in items){
            if(i == args[0])
                //Get item value
                itemValue = items[i]['value'];
        }

        //Check if the user typed a valid item to craft, and if not give a message
        if(typeof itemValue == 'undefined' || itemValue == ""){
            message.channel.send(`${message.author}, Cannot find the item you are trying to sell.`);
            return;
        }

        if(equipment){
            //Check to see if the user has the required equipment to sell
            sql1 = `SELECT ${args[1]} FROM Users WHERE id = ${message.author.id}`;
            connection.query(sql1, (err, rows) =>{
                if(rows[0][args[1]] != 'NONE'){
                    //Have a check to ensure user want to sell equipment
                    let filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no' || m.content.toLowerCase() == 'y' || m.content.toLowerCase() == 'n');
                    message.channel.send(`Are you sure you want to sell ${args[0]}? \`Yes/No\``).then(() => {
                        message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time'] })
                            .then(mes => {
                                //Convert message to lowercase
                                var command = mes.first().content.toLowerCase();
            
                                //If the user enters y or yes sell equipment
                                if (command == 'yes' || command == 'y') {
                                    //Create query to remove equipment sold
                                    sqlUpdate2 = `UPDATE Users SET ${args[1]} = 'NONE' WHERE id = ${message.author.id}`;
                                    
                                    //Sell equipment
                                    sell(amount, args[0], itemValue, sqlUpdate2, message.author.id, message.channel.id)
                                } else if (command == 'no' || command == 'n') {
                                    message.channel.send(`${message.author}, ${args[0]} ${items[args[0]]['emoji']} not sold.`);
                                }
                            })
                                //If the user doesnt enter a valid response, output not sold message
                                .catch(collected => {
                                    message.channel.send(`${message.author}, ${args[0]} ${items[args[0]]['emoji']} not sold.`);
                            });
                        });

                    
                } else{
                    message.channel.send(`${message.author}, You do not have a ${args[0]} to sell.`);
                }
            });
        }else{
            //Check to see if the user has the required items to sell
            sql1 = `SELECT ${args[0]} FROM Inventory WHERE id = ${message.author.id}`;
            connection.query(sql1, (err, rows) =>{
                if(rows[0][args[0]] >= amount){
                    //Create query to remove items sold
                    sqlUpdate2 = `UPDATE Inventory SET ${args[0]} = ${args[0]} - ${amount} WHERE id = ${message.author.id}`;

                    sell(amount, args[0], itemValue, sqlUpdate2, message.author.id, message.channel.id)
                } else{
                    message.channel.send(`${message.author}, You do not have ${amount} ${args[0]} to sell.`);
                }
            });
            
        }
    }
}

function sell(amount, item, itemValue, queary, author, channelID){
            //Create query to increase users money
            sqlUpdate1 = `UPDATE Users SET gold = gold + (${itemValue} * ${amount}) WHERE id = ${author}`;

            //Queary the database
            connection.query(sqlUpdate1);
            connection.query(queary);
    
            //Generate output message
            output = `You have sold `;
            if(amount == 1)
                output += `a ${item} `;
            else
                output += `${amount} ${item}'s `;
            output += `${items[item]['emoji']} for ${itemValue * amount} gold.`;
    
            //Output sold message
            const channel = client.channels.cache.get(channelID);
            channel.send(output);
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