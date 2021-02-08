//include the json file that holds all of the crafting recipes and items used to craft
const RECIPES = require('../jsons/recipes.json');
const {items} = require('../jsons/items.json');

module.exports={
    name: 'craft',
    description: "Used to craft items within the game",
    execute(message, args){

        var amount = 1;

        //Check if the player has supplied an item to craft and give a message if they do no use the command correctly
        if(args.length < 1){
            message.channel.send(`${message.author}, the proper use of this command is \`adv craft [item]\` \nYou can see the recipes with \`adv recipes\``);
            return;
        }

        // test the second argument, see if it is equipment
        if(args[1] === "sword" || args[1] === "shield" || args[1] === "armor" || args[1] === "pickaxe" || args[1] === "axe"){
            // combine the args into one string
            args[0] = args[0].concat(' ', args[1]);
        // otherwise check if args[1] is set, if it is, pass it to get value function to see how many items to be crafted
        } else { 
            if(typeof args[1] != 'undefined')
                amount = calcAmount(args[1]);
        }

        // if the amount is -1 (set for error.) Return and print an error
        if(amount === -1){
            message.channel.send(`${message.author}, The amount to craft is invalid. Please give a number to craft. \nValid shorthand notaion \`k=1000\`, \`m=1000000\`, \`b=1000000000\`. Ex. \`adv craft [item] 5k\`. \nType \`adv help\` for help`);
            return;
        } 

        // set the recipe string to empty string
        let recipe = "";
        
        // to be used to decide if its equipment or an item, since equipment can only be crafted once
        let itemType = "";

        //Find the recipe for the item the player is trying to craft
        for(category in RECIPES){
            for(r in RECIPES[category]){
                if(r == args[0]){
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
                message.channel.send(`Soemthing went wrong`)
            } else {
                var craftable = true;

                //variable to store the error message that the user does not have enough materials and showing what they are missing.
                var error = ""; 
                var sql2 = `UPDATE Inventory SET `;
                //Check if the player has the required items to craft the item
                for(i in recipe){
                    var itemName = recipe[i]['itemname'];
                    // multiple the quantity by the amount to be made
                    var quantity = parseInt(recipe[i]['quantity']) * amount;
                    if(rows[0][recipe[i]['itemname']] < quantity){
                        //error += `${rows[0][recipe[i]['itemname']]}/ ${recipe[i]['quantity']} ${recipe[i]['itemname']} ` + getEmoji(recipe[i]['itemname']) + ` :x:`;
                        error += `${rows[0][recipe[i]['itemname']]}/${quantity} ` + getEmoji(itemName) + `${itemName} :x:\n`;
                        craftable = false;
                    } else {
                        error += `${rows[0][recipe[i]['itemname']]}/${quantity} ` + getEmoji(itemName) + ` ${itemName} :white_check_mark:\n`;
                        //prep the sql statement
                        sql2 += `${itemName} = ${itemName} - ${quantity}, `;                
                    }
                }
                
                //If the user has the required items, create query to remove those items from inventory and add the craft item
                if(craftable){
                    // if equipment, check if the user already has the equipment
                    if(itemType == "equipment"){
                        let sql3 = `SELECT ${args[1]} FROM Users WHERE id = '${message.author.id}'`;
                        connection.query(sql3, (err, rows2) =>{
                            if(err) throw err;
                            // if the user has already has the equipment
                            if(rows2[0][args[1]] != "NONE") {
                                message.channel.send(`${message.author}, You already have a ${args[1]}. You must sell this equipment before crafting a new one. \nIt can be sold using \`adv sell ${args[1]}\``);
                                return;
                            // user does not have this equipment
                            } else {

                                // finish removing the items required for crafting from the database
                                // remove extra comma
                                sql2 = sql2.slice(0, -2);
                                sql2 += ` WHERE id = '${message.author.id}'`;
                                //prep the sql query to add the equipment into the users table
                                let sql4 = `UPDATE Users SET ${args[1]} = '${item}'`;
                                // if it is sword, shield, or armor
                                // update the users attack and defense
                                if(args[1] == 'sword' || args[1] == 'shield' || args[1] == 'armor'){
                                    let stats = getStats(item);
                                    sql4 += `, attack = attack + ${stats[0]}, defence = defence + ${stats[1]}`;
                                }
                                sql4 += ` WHERE id = '${message.author.id}'`;
                                // query the database
                                message.channel.send(`You have crafted a ${item} ` + getEmoji(item));
                                connection.query(sql4);
                                connection.query(sql2);

                            }
                        });
                    //if the item crafted is not equipment
                    } else{
                        // append the item and the user to the sql query
                        sql2 += `${item} = ${item} + ${amount} WHERE id = '${message.author.id}'`;
                        if(amount == 1){
                            message.channel.send(`You have crafted a ${item} ` + getEmoji(item));
                        } else {
                            message.channel.send(`You have crafted ${amount} ${item}'s ` + getEmoji(item));
                        }

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

//function to get the emoji id for an item
function getEmoji(item){

    // traverse the items json file to find the item requested
    for(i in items){
        if(i == item)
            // return the emoji id
            return (items[i].emoji);
    }

}

//function to get the stats for an item
function getStats(item){

    // traverse the items json file to find the item requested
    for(i in items){
        if(i == item){
            let stats = [items[i].attack,items[i].defence];
            // return the stats id
            return stats;
        }
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