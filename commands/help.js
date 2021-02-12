const Discord = require('discord.js');

// include the json file that holds all of the items names and emoji codes
const {items} = require('../jsons/items.json');

module.exports={
    name: 'help',
    description: "Give user help",
    execute(message, args){

        if(args[0] == "" || args[0] == null){
            
            //Create the embed to output
            var helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF69B4')
                .addFields(
                    { name: `Help`, value: `General help will go here`},
                );

                //Send Embed
                message.channel.send(helpEmbed);
            return;
        }

        let itemSearch = "";
        // combine the arguments in case of item
        for(var i = 0; i < args.length; i++){
            itemSearch += args[i] + " ";
        }
        // remove extra space
        itemSearch = itemSearch.slice(0, -1);
        
        // loop through items json to find it
        for(i in items){
            if(i === itemSearch){
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                .addFields(
                    { name: `${items[i]['name']}  ${items[i]['emoji']}`, value: items[i]['description']},
                    { name: `Sell Value`, value: items[i]['value']},
                );
                
                // if the second arg is sword shield or armor, add new field for stats
                if(args[1] == 'sword' || args[1] == 'shield' || args[1] == 'armor'){
                    helpEmbed.addFields({name: 'Stats', value: `Attack :crossed_swords:: ${items[i]['attack']}, Defence :shield:: ${items[i]['defence']}`});
                }

                helpEmbed 
                .setColor('#FF69B4')
                .setFooter(`Use "adv help" for general help`);

                message.channel.send(helpEmbed);
                return;

            }
        }

        switch(args[0]){
            case 'find':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Find`, value: `Used in area 0 to find tha materials to get your first set of equipment.`},
                        { name: `Possible Items:`, value: `${items['stick']['emoji']} ${items['log']['emoji']} ${items['pebble']['emoji']} ${items['stone']['emoji']}`},
                        { name: `Usage:`, value: `\`adv find\``}
                    );

                break;
            case 'area':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Area`, value: `Used to move to another area. Usually used if enemies are too strong in your current area or you need to get resources from a specific area.\nNew areas are unlocked by beating the boss in an area.`},
                        { name: `Usage:`, value: `\`adv area <# of area>\``}
                    );
    
                break;
            case 'craft':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Craft`, value: `Used to craft items and equipment. Use the \`recipes\` command to see the list of recipes that can be crafted.\nNote that you cannot carry more than one item of the same equipment type. For example you can only have one sword and one armor at once, so you have to sell your current one to craft another.`},
                        { name: `Usage:`, value: `\`adv craft <item name> [# to craft]\``}
                    );

                break;
            case 'disassemble':
            case 'diss':
            case 'da':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Disasemble`, value: `Used to disasemble an item to get its components back. This will only give back 50% of the recipe cost.`},
                        { name: `Usage:`, value: `\`adv disassemble <item name> [# to disassemble]\``},
                        { name: `Alias`, value:  `\`disasemble\` \`diss\` \`da\``}
                    );
    
                break;

            default:
                var helpEmbed = new Discord.MessageEmbed()
                        .setDescription("Cannot find a help page for that.")
                

        }
        //Add last details to help embed
        helpEmbed
            .setColor('#FF69B4')
            .setFooter(`Use "adv help" for general help`)
            

        //Send Embed
        message.channel.send(helpEmbed);
        
    }
}