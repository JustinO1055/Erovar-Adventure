//include the json file that holds all of the crafting recipes and items used to craft
const RECIPES = require('../jsons/recipes.json');
const {items} = require('../jsons/items.json');

//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

module.exports={
    name: 'disassemble',
    description: "Used to disassemble items within the game. Will get 50% of the materials back (rounded down)",
    execute(message, args){

        var amount = 1;

        // check the arg to make sure its not equipment. if it is equipment. warn the user they can not disassemble it
        if(args[0] === "sword" || args[0] === "shield" || args[0] === "armor" || args[0] === "pickaxe" || args[0] === "axe" || args[1] === "sword" || args[1] === "shield" || args[1] === "armor" || args[1] === "pickaxe" || args[1] === "axe"){
            message.channel.send(`${message.author}, You can not disassmble equipment. You are able to sell the equipment using \`adv sell <equipment>\` \nType \`adv help\` for help`);
        // otherwise check if args[1] is set, if it is, pass it to get value function to see how many items to be crafted
        } else { 
            if(typeof args[1] != 'undefined')
                amount = functions.calcAmount(args[1]);
        }

        // if the amount is -1 (set for error.) Return and print an error
        if(amount === -1){
            message.channel.send(`${message.author}, The amount to disassemble is invalid. Please give a number to disassemble. \nValid shorthand notaion \`k=1000\`, \`m=1000000\`, \`b=1000000000\`. Ex. \`adv disassemble <item> 5k\`. \nType \`adv help\` for help`);
            return;
        } 

        //Find the recipe for the item the player is trying to craft
        for(r in RECIPES['items']){
            if(r == args[0]){
                recipe = RECIPES['items'][r];
                break;
            }
        }
        //Check if the user typed a valid item to craft, and if not give a message
        if(typeof recipe == 'undefined' || recipe == ""){
            message.channel.send(`${message.author}, Cannot find the item you are trying to disassemble. **Items will be disassembled at 50% of recipe cost.** \nYou can see the recipes with \`adv recipes\``);
            return;
        }

        // get the amount of the item to d/a from the users inventory
        let sql = `SELECT ${args[0]} FROM Inventory WHERE id = '${message.author.id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            // if the amount requested to d/a is greater than the amount the user has. Print an error and return
            if(amount > rows[0][args[0]]){
                message.channel.send(`${message.author}, You do not have enough ${args[0]} to disassemble. Check your inventory with \`adv inventory\` to see how many you have and try again.\nType \`adv help\` for help`)
                return;
            } else {
                // prep the sql query
                let sql2 = `UPDATE Inventory SET `;
                //prep the message
                let msg = `You have disassembled ${amount} ${args[0]}`;
                if(amount > 1){message += "'s"};
                msg += ` into `;
                // go through the recipe, multiply the amount by the required amount and divide by two, floor this value to get the amount to return
                for(i in recipe){
                    var itemname = recipe[i]['itemname'];
                    var quantity = Math.floor(parseInt(recipe[i]['quantity']) * amount * 0.5);
                    // append it to sql 
                    sql2 += `${itemname} = ${itemname} + ${quantity}, `;
                    //append to message
                    msg += `${quantity} ${itemname}'s ${functions.getEmoji(itemname)}, `;
                }

                // remove the extra comma from message
                msg = msg.slice(0, -2);

                //finish the sql query
                sql2 += `${args[0]} = ${args[0]} - ${amount} WHERE id = '${message.author.id}'`;

                // query the database and print the message.
                connection.query(sql2);
                message.channel.send(msg);
                return;
            }

        });
        
    }
}