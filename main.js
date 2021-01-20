const Discord = require('discord.js');
const login = require('./login.json');

// setting up the client for the bot to connect to discord
const client = new Discord.Client();
global.client = client;

// setting a value for the prefix for the bot to look for at the start of a message
const regExPrefix = /^[a][d][v] /i;

client.once('ready', () => {
    console.log('Online');
});

//when a message is sent in the chat, check the message
client.on('message', message => {

    // if the message matches the set prefix (adv ) and passes the regex, execute the given command
    if(regExPrefix.test(message.content)){

        // split the message by removing the prefix, split the words by using the delimiter " "
        const args = message.content.substring(4).split(/ +/);
        const command = args.shift().toLowerCase();

        if (command == 'ping'){
            message.reply("pog");
        }

    }

});

// allows the bot to log in. Token is gathered from login.json
// token is essentially the password so is kept private
client.login(login.token);