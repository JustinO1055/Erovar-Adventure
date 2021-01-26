const Discord = require('discord.js');
const RECIPES = require('../recipes.json');
const {items} = require('../items.json');

module.exports={
    name: 'recipes',
    description: "Command to see the recipes",
    execute(message, args){

        category = args[0]?.toLowerCase();
        
        //Check if the player has supplied a category to see the recupes of and give a message if they do no use the command correctly
        if(args.length < 1 || !(category == "items" || category == "equipment")){
            message.channel.send(`${message.author}, the proper use of this command is \`adv recipes [category]\``);
            return;
        }

        var list = "";
        for(r in RECIPES[category]){
            list += `${items[r]['emoji']} ${r} ➜  `;
            for(i in RECIPES[category][r]){
                list += `${RECIPES[category][r][i]['quantity']} ${items[RECIPES[category][r][i]['itemname']]['emoji']} ${RECIPES[category][r][i]['itemname']}`;
            }
            list += "\n";
        }

            //Create the embed to output
            const recipesEmbed = new Discord.MessageEmbed()
                .setColor('#0a008c')
                .setAuthor(`${category.charAt(0).toUpperCase() + category.slice(1)} recipes`)
                .setDescription(list)

            //Send Embed
            message.channel.send(recipesEmbed);

    }
}