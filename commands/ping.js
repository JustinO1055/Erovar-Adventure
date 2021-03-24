const Discord = require('discord.js');
var functions = require('../functions.js');

const monsterBattle = require('../classes/monsterBattle.js');
const monsterExpedition = require('../classes/monsterBattle.js');
const factoryMonster = require('../classes/monsterFactory.js');

module.exports={
    name: 'ping',
    description: "Ping Pong :). Used to ensure bot is online",
    execute(message, args){
        message.channel.send('pong. :)');
    }
}