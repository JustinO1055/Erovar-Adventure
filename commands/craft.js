//include the json file that holds all of the crafting recipes and items used to craft
const RECIPES = require('../jsons/recipes.json');
const {items} = require('../jsons/items.json');

//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

module.exports={
    name: 'craft',
    description: "Used to craft items within the game",
    execute(message, args){

        //Check if the player has supplied an item to craft and give a message if they do no use the command correctly
        if(args.length < 1){
            message.channel.send(`${message.author}, the proper use of this command is \`adv craft <item>\` \nYou can see the recipes with \`adv recipes\``);
            return;
        }
        
        //Parse argument list
        var arguments = functions.parseArguments(args);

        // set the recipe string to empty string
        let recipe = "";

        // to be used to decide if its equipment or an item, since equipment can only be crafted once
        let itemType = "";

        //Find the recipe for the item the player is trying to craft
        for(category in RECIPES){
            for(r in RECIPES[category]){
                if(r === arguments[0]){
                    recipe = RECIPES[category][r];
                    item = r;
                    itemType = category;
                    break;
                }
            }
        }

        //Check if the user typed a valid item to craft, and if not give a message
        if(typeof recipe == 'undefined' || recipe == ""){
            message.channel.send(`${message.author}, Cannot find the item you are trying to craft. \nYou can see the recipes with \`adv recipes\``);
            return;
        }

        //Get the users inventory
        let sql = `SELECT * FROM Inventory WHERE id = '${message.author.id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //Ensure a row was returned
            if(rows.length < 1){
                message.channel.send(`Something went wrong`)
            } else {
                var craftable = true;

                //variable to store the error message that the user does not have enough materials and showing what they are missing.
                var error = ""; 
                var sql2 = `UPDATE Inventory SET `;

                // compute the artisan xp earned from crafting
                var xpEarned = Math.floor(recipe['xp'] * arguments[1]);
                //Check if the player has the required items to craft the item
                // recipe items are stored in a 2d array with first element being the name, second element being the quantity
                for(var i = 0; i < recipe['items'].length; i++){
                    var itemName = recipe['items'][i][0];

                    // multiple the quantity by the amount to be made
                    var quantity = parseInt(recipe['items'][i][1]) * arguments[1];
                    if(rows[0][itemName] < quantity){
                        //error += `${rows[0][recipe[i]['itemname']]}/ ${recipe[i]['quantity']} ${recipe[i]['itemname']} ` + getEmoji(recipe[i]['itemname']) + ` :x:`;
                        error += `${rows[0][itemName]}/${quantity} ` + functions.getEmoji(itemName) + `${items[itemName]['name']} :x:\n`;
                        craftable = false;
                    } else {
                        error += `${rows[0][itemName]}/${quantity} ` + functions.getEmoji(itemName) + ` ${items[itemName]['name']} :white_check_mark:\n`;
                        //prep the sql statement
                        sql2 += `${itemName} = ${itemName} - ${quantity}, `;                
                    }
                }
                
                //If the user has the required items, create query to remove those items from inventory and add the craft item
                if(craftable){
                    // if equipment, check if the user already has the equipment
                    if(itemType == "equipment"){
                        let equipmentType = arguments[2];
                        
                        let sql3 = `SELECT ${equipmentType} FROM Users WHERE id = '${message.author.id}'`;
                        connection.query(sql3, (err, rows2) =>{
                            if(err) throw err;
                            // if the user has already has the equipment
                            if(rows2[0][equipmentType] != "NONE") {
                                message.channel.send(`${message.author}, You already have a ${equipmentType}. You must sell this equipment before crafting a new one. \nIt can be sold using \`adv sell ${equipmentType}\``);
                                return;
                            // user does not have this equipment
                            } else {

                                // finish removing the items required for crafting from the database
                                // remove extra comma
                                sql2 = sql2.slice(0, -2);
                                sql2 += ` WHERE id = '${message.author.id}'`;
                                //prep the sql query to add the equipment into the users table
                                let sql4 = `UPDATE Users SET ${equipmentType} = '${arguments[0]}'`;
                                // if it is sword, shield, or armor
                                // update the users attack and defense
                                if(equipmentType == 'sword' || equipmentType == 'shield' || equipmentType == 'armor'){
                                    let stats = functions.getStats(arguments[0]);
                                    sql4 += `, attack = attack + ${stats[0]}, defence = defence + ${stats[1]}`;
                                }
                                sql4 += ` WHERE id = '${message.author.id}'`;

                                // prep adding xp to the user
                                let sql5 = `UPDATE Skills SET artisan = artisan + ${xpEarned} WHERE id = '${message.author.id}'`;

                                // print message
                                message.channel.send(`You have crafted a ${items[arguments[0]]['name']} ` + functions.getEmoji(arguments[0]));
                                 // query the database
                                connection.query(sql4);
                                connection.query(sql2);
                                connection.query(sql5);

                            }
                        });
                    //if the item crafted is not equipment
                    } else{
                        // append the item and the user to the sql query
                        sql2 += `${arguments[0]} = ${arguments[0]} + ${arguments[1]} WHERE id = '${message.author.id}'`;
                        if(arguments[1] == 1){
                            message.channel.send(`You have crafted a ${items[arguments[0]]['name']} ` + functions.getEmoji(arguments[0]));
                        } else {
                            message.channel.send(`You have crafted ${arguments[1]} ${items[arguments[0]]['name']}s ` + functions.getEmoji(arguments[0]));
                        }
                        
                        // prep adding xp to the user
                        let sql5 = `UPDATE Skills SET artisan = artisan + ${xpEarned} WHERE id = '${message.author.id}'`;

                        connection.query(sql5);
                        connection.query(sql2);
                        return;

                    }
                    

                } else{
                    message.channel.send(`${message.author}, You do not have enough items to craft this. \n` + error + `\nYou can see the recipes with \`adv recipes\``);
                    return;
                }
            }
        });
    }
}