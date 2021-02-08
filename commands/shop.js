const Discord = require('discord.js');
const {shop} = require('../jsons/items.json');
module.exports = {
    name: 'shop',
    description: "shows the inventory of the shop",
    execute(message, args){

        // create the embed message
        let shopMsg = "";

        // go through the list of the shop items and add them to the embed message
        for(s in shop){
            shopMsg += `${shop[s]['emoji']} \`${shop[s]['name']}\` - ${shop[s]['description']} - ${shop[s]['cost']} gold`;
        }

        //Create the embed to output
        const shopEmbed = new Discord.MessageEmbed()
        .setColor('#0a008c')
        .setTitle("Shop Inventory")
        .addFields(
            { name: 'Help', value: 'You can buy items by using `adv buy [item]`'},
            { name: 'Inventory', value: shopMsg},
        );

        // send the embed
        message.channel.send(shopEmbed);

    }
}