//include the json file that holds all of the crafting recipes and items used to craft
//const {itemRecipes, equipment} = require('../recipes.json');
const RECIPES = require('../recipes.json');

module.exports={
    name: 'craft',
    description: "Used to craft items within the game",
    execute(message, args){

        //Check if the player has supplied an item to craft and give a message if they do no use the command correctly
        if(args.length < 1){
            message.channel.send(`${message.author}, the proper use of this command is \`adv craft [item]\` \nYou can see the recipes with \`adv recipes\``);
            return;
        }
           
        //Find the recipe for the item the player is trying to craft
        for(category in RECIPES){
            for(r in RECIPES[category]){
                if(r == args[0]){
                    recipe = RECIPES[category][r];
                    item = r;
                    break;
                }
            }
        }

        //Check if the user typed a valid item to craft, and if not give a message
        if(typeof recipe == 'undefined'){
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
                //Check if the player has the required items to craft the item
                for(i in recipe){
                    if(rows[0][recipe[i]['itemname']] < recipe[i]['quantity'])
                        craftable = false;
                }

                //If the user has the required items, create query to remove those items from inventory and add the craft item
                if(craftable){
                    message.channel.send(`You have craft a ${item}`);
                    return;
                } else{
                    message.channel.send(`${message.author}, You do not have enough items to craft this. \nYou can see the recipes with \`adv recipes\``);
                    return;
                }
            }
        });
    }
}