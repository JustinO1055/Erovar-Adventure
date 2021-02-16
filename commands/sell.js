const {items} = require('../jsons/items.json');

//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

module.exports={
    name: 'sell',
    description: "Used to sell equipment and items",
    execute(message, args){
        //Check if the player has supplied an item to sell and give a message if they do no use the command correctly
        if(args.length < 1){
            message.channel.send(`${message.author}, the proper use of this command is \`adv sell <item>\``);
            return;
        }

        //Parse argument list
        var arguments = functions.parseArguments(args);

        //Create array to store all information of the sell
        // 0 - Item Name
        // 1 - Generic Equipment Term
        // 2 - Value of Item
        // 3 - Amount to Sell
        // 4 - Is equipment 
        var sellingInformation = new Array();

        //Push Current information into sell array
        sellingInformation.push(arguments[0]);
        sellingInformation.push(null);
        sellingInformation.push(0);
        sellingInformation.push(arguments[1]);
        sellingInformation.push(false);


        //Check if user specified a generic equipment type to sell
        if(sellingInformation[0] === "sword" || sellingInformation[0] === "shield" || sellingInformation[0] === "armor" || sellingInformation[0] === "pickaxe" || sellingInformation[0] === "axe"){
            sellingInformation[1] = sellingInformation[0];
            sellingInformation[0] = "";
            sellingInformation[4] = true;
        } else {      
            //Check to ensure the player supplied a valid item and get the items value
            for(i in items){
                if(i == sellingInformation[0]){
                    //Get item value
                    sellingInformation[2] = items[i]['value'];

                    //Check if item is equipment
                    if(items[i]['type'] == 'equipment')
                        sellingInformation[4] = true;
                }
            }

            //Check if the user typed a valid item to sell, and if not give a message
            if(sellingInformation[2] == 0){
                message.channel.send(`${message.author}, Cannot find the item you are trying to sell.`);
                return;
            }
        }

        //If the player is selling equipment, call sellEquipment function
        if(sellingInformation[4])
            sellEquipment(sellingInformation, message);
        else {
            //Check to see if the user has the required items to sell
            sql1 = `SELECT ${arguments[0]} FROM Inventory WHERE id = ${message.author.id}`;
            connection.query(sql1, (err, rows) =>{
                if(rows[0][arguments[0]] >= sellingInformation[3]){
                    //Create query to remove items sold
                    sqlUpdate = `UPDATE Inventory SET ${arguments[0]} = ${arguments[0]} - ${sellingInformation[3]} WHERE id = ${message.author.id}`;

                    sell(sellingInformation[3], sellingInformation[0], sellingInformation[2], sqlUpdate, message.author.id, message.channel.id)
                } else{
                    message.channel.send(`${message.author}, You do not have ${sellingInformation[3]} ${items[sellingInformation[1]]['name']} to sell.`);
                }
            });
        }

    }
}

async function sellEquipment(sellingInformation, message){
    //Declare variable to store whether player can sell the equipment
    var valid = true;

    //If user specified a generic equipment type to sell, get the name of the item they are trying to sell
    if(sellingInformation[1] != null){

        //Check if user has the equipment to sell
        sellingInformation[0] = await validateEquipment(sellingInformation, message.author.id);

        if(sellingInformation[0] != null){
            //Get the value of the item they are selling
            for(i in items){
                if(i == sellingInformation[0])
                    //Get item value
                    sellingInformation[2] = items[i]['value'];
            }
        }else {
            //If they did not have the equipment to sell, output message and exit function
            message.channel.send(`${message.author}, You do not have a ${sellingInformation[1]} to sell.`);
            valid = false
        }
    } else {
        //Get the generic equipment term of the item they are selling
        var itemNameVar = sellingInformation[0].split("_");
        sellingInformation[1] =  itemNameVar[itemNameVar.length - 1];

        //Check if user has the equipment to sell
        if(await validateEquipment(sellingInformation, message.author.id) == null){
            //If they did not have the equipment to sell, output message and exit function
            message.channel.send(`${message.author}, You do not have a ${items[sellingInformation[0]]['name']} to sell.`);
            valid = false
        }
    }

    //If the users cannot sell equipment, exit function
    if(!valid)
        return

    //Have a check to ensure user want to sell equipment
    let filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no' || m.content.toLowerCase() == 'y' || m.content.toLowerCase() == 'n');
    message.channel.send(`Are you sure you want to sell ${items[sellingInformation[0]]['name']} ${items[sellingInformation[0]]['emoji']}? \`Yes/No\``).then(() => {
        message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time'] })
            .then(mes => {
                //Convert message to lowercase
                var command = mes.first().content.toLowerCase();

                //If the user enters y or yes sell equipment
                if (command == 'yes' || command == 'y') {
                    //Create query to remove equipment sold
                    let sqlUpdate = `UPDATE Users SET ${sellingInformation[1]} = 'NONE'`;                   
                    // if it is sword, shield, or armor
                    // update the users attack and defense
                    if(sellingInformation[1] == 'sword' || sellingInformation[1] == 'shield' || sellingInformation[1] == 'armor'){
                        stats = functions.getStats(sellingInformation[0]);
                        sqlUpdate += `, attack = attack - ${stats[0]}, defence = defence - ${stats[1]}`;
                    }
                    sqlUpdate += ` WHERE id = ${message.author.id}`;
                    
                    //Sell equipment
                    sell(sellingInformation[3], sellingInformation[0], sellingInformation[2], sqlUpdate, message.author.id, message.channel.id)
                } else if (command == 'no' || command == 'n') {
                    message.channel.send(`${message.author}, ${items[sellingInformation[0]]['name']} ${items[sellingInformation[0]]['emoji']} not sold.`);
                }
            })
                //If the user doesn't enter a valid response, output not sold message
                .catch(collected => {
                    message.channel.send(`${message.author}, ${items[sellingInformation[0]]['name']} ${items[sellingInformation[0]]['emoji']} not sold.`);
            });
        });
}

//Function to get the users equipment name if they have one, otherwise return null
function validateEquipment(sellingInformation, id){
    return new Promise(resolve => {
        //Check if the player has the item to sell
        sql1 = `SELECT ${sellingInformation[1]} FROM Users WHERE id = '${id}'`;
        connection.query(sql1, (err, rows) =>{
            if(rows[0][sellingInformation[1]] != 'NONE'){
                resolve (rows[0][sellingInformation[1]]);
            } else {
                resolve (null);
            }
        });
    });
}

//Function to process the sell transaction
function sell(amount, item, itemValue, query, author, channelID){
            //Create query to increase users money
            sqlUpdate1 = `UPDATE Users SET gold = gold + (${itemValue} * ${amount}) WHERE id = ${author}`;

            //Query the database
            connection.query(sqlUpdate1);
            connection.query(query);
    
            //Generate output message
            output = `You have sold `;
            if(amount == 1)
                output += `a ${items[item]['name']} `;
            else
                output += `${amount} ${items[item]['name']}s `;
            output += `${items[item]['emoji']} for ${itemValue * amount} gold.`;
    
            //Output sold message
            const channel = client.channels.cache.get(channelID);
            channel.send(output);
}