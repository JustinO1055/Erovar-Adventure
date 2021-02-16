//include the json file that holds all of the crafting recipes and items used to craft
const RECIPES = require('../jsons/recipes.json');
const {items} = require('../jsons/items.json');

//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

module.exports={
    name: 'disassemble',
    description: "Used to disassemble items within the game. Will get 50% of the materials back (rounded down)",
    execute(message, args){

        //Check if the player has supplied an item to craft and give a message if they do no use the command correctly
        if(args.length < 1){
            message.channel.send(`${message.author}, the proper use of this command is \`adv disassemble <item>\` \nYou can see the recipes with \`adv recipes\``);
            return;
        }

        //Parse argument list
        var arguments = functions.parseArguments(args);

        //Declare recipes variable to store the recipe of the item to be disassembled
        recipe = "";

        //Find the recipe for the item the player is trying to disassemble
        for(r in RECIPES['items']){
            if(r == arguments[0]){
                recipe = RECIPES['items'][r];
                break;
            }
        }

        //Check if the item was a valid recipe to disassemble
        if(recipe == ""){
            message.channel.send(`${message.author}, Cannot find the item you are trying to disassemble. **Items will be disassembled at 50% of recipe cost.** \nYou can see the recipes with \`adv recipes\``);
            return;
        }

        // get the amount of the item to d/a from the users inventory
        let sql = `SELECT ${arguments[0]} FROM Inventory WHERE id = '${message.author.id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            // if the amount requested to d/a is greater than the amount the user has. Print an error and return
            if(arguments[1] > rows[0][arguments[0]]){
                message.channel.send(`${message.author}, You do not have enough ${items[arguments[0]]['name']} to disassemble. Check your inventory with \`adv inventory\` to see how many you have and try again.\nType \`adv help\` for help`)
                return;
            } else {
                // prep the sql query
                let sql2 = `UPDATE Inventory SET `;
                //prep the message
                let msg = `You have disassembled ${arguments[1]} ${items[arguments[0]]['name']}`;
                if(arguments[1] > 1){msg += "s"};
                msg += ` into `;
                // go through the recipe, multiply the amount by the required amount and divide by two, floor this value to get the amount to return
                for(i in recipe){
                    var itemname = recipe[i]['itemname'];
                    var quantity = Math.floor(parseInt(recipe[i]['quantity']) * arguments[1] * 0.5);
                    // append it to sql 
                    sql2 += `${itemname} = ${itemname} + ${quantity}, `;
                    //append to message
                    msg += `${quantity} ${itemname[0].toUpperCase() + itemname.substr(1)}s ${functions.getEmoji(itemname)}, `;
                }

                // remove the extra comma from message
                msg = msg.slice(0, -2);

                //finish the sql query
                sql2 += `${arguments[0]} = ${arguments[0]} - ${arguments[1]} WHERE id = '${message.author.id}'`;

                // query the database and print the message.
                connection.query(sql2);
                message.channel.send(msg);
                return;
            }

        });
        
    }
}