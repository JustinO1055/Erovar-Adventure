const Discord = require('discord.js');

module.exports={
    name: 'invite',
    description: "Displays links to the bot/ official channel",
    execute(message, args){

        //Create the embed to invite
        const inviteEmbed = new Discord.MessageEmbed()
        .setColor('#0a008c')
        .setTitle(`Useful Links`)
        .addFields(
            { name: 'Links', value: `Feel free to invite Erovar Adventure into your own servers to play with. If you need suppport, feel free to join the offical Erovar Adventure discord server.
            \n**[Invite Link](https://discord.com/oauth2/authorize?client_id=797230767281405993&scope=bot&permissions=1544551543)** | **[Offical Server](https://discord.gg/9SXS7UP43u)**`},
           
        );

        message.channel.send(inviteEmbed);
    }
}