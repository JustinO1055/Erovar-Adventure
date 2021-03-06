const Discord = require('discord.js');
const RECIPES = require('../jsons/recipes.json');
const {items} = require('../jsons/items.json');

module.exports={
    name: 'recipes',
    description: "Command to see the recipes",
    execute(message, args){

        category = args[0]?.toLowerCase();
        
        //Check if the player has supplied a category to see the recupes of and give a message if they do no use the command correctly
        if(args.length < 1 || !(category == "items" || category == "equipment")){
            message.channel.send(`${message.author}, the proper use of this command is \`adv recipes <category>\` \nValid categories are \`equipment\`, \`items\``);
            return;
        }

        if(category == "items" && args[1] != 1){
            page = 1;
        } else if(category == "equipment" && args[1] != 1 && args[1] != 2 && args[1] != 3){
            page = 1;
        } else{
            page = args[1];
        }

        // Below is code for having the items on the right side of arrow
        /*//Generate the list of recipes
        var list = "";
        for(r in RECIPES[category]){

            for(i in RECIPES[category][r]){
                list += `${RECIPES[category][r]['items'][i][1]} ${items[RECIPES[category][r]['items'][i][0]]['emoji']}  + `;
            }
            list = list.slice(0, -2);
            list += ` ➜ ${items[r]['emoji']} ${r}`;

            list += "\n";
        } */
        //Generate the list of recipes
        var list = "";
        for(r in RECIPES[category]){
            if(RECIPES[category][r]['page'] == page){
                list += `${items[r]['emoji']} ${items[r]['name']} ➜  `;

                // recipe items are stored in a 2d array with first element being the name, second element being the quantity
                for(var i = 0; i < RECIPES[category][r]['items'].length; i++){
                    list += `${RECIPES[category][r]['items'][i][1]} ${items[RECIPES[category][r]['items'][i][0]]['emoji']} + `;
                }
                list = list.slice(0, -2);
                list += "\n";
            }
            
        }

        //Create footer based off of category
        if(category == "items")
            var footer = `Page ${page}/1`;
        else
            var footer = `Page ${page}/3`;

        //Create the embed to output
        const recipesEmbed = new Discord.MessageEmbed()
            .setColor('#0a008c')
            .setAuthor(`${category.charAt(0).toUpperCase() + category.slice(1)} recipes`)
            .setDescription(list)
            .setFooter(footer + "   |   use 'adv recipes <category> <page>' to see a specific page");

        //Send Embed
        message.channel.send(recipesEmbed);

    }
}