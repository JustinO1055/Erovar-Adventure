
var functions = require('../functions.js');
module.exports={
    name: 'ping',
    description: "Ping Pong :). Used to ensure bot is online",
    execute(message, args){
        message.channel.send('pong. :)');
        console.log(`${functions.getEmoji('stone_axe')}`);
        
    }
}