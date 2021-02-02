const Discord = require('discord.js');

module.exports={
    name: 'help',
    description: "Give user help",
    execute(message, args){

        if(args[0] == "" || args[0] == null){
            
            //Create the embed to output
            var helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF69B4')
                .setDescription("Help will go here");

            //Send Embed
            message.channel.send(helpEmbed);
            return;
        }

        switch(args[0]){
            case 'find':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setDescription("Specialized help for find will go here");
    
                //Send Embed
                message.channel.send(helpEmbed);
                break;
            case 'area':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setDescription("Specialized help for area will go here");
    
                //Send Embed
                message.channel.send(helpEmbed);
                break;
            case 'craft':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setDescription("Specialized help for craft will go here");
    
                //Send Embed
                message.channel.send(helpEmbed);
                break;
            case 'disassemble':
            case 'diss':
            case 'da':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setDescription("Specialized help for disassemble will go here");
    
                //Send Embed
                message.channel.send(helpEmbed);
                break;
                

        }
        
    }
}