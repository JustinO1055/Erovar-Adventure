const Discord = require('discord.js');
var functions = require('../functions.js');

const quiz = require('../jsons/training.json');
const item = quiz[Math.floor(Math.random() * quiz.length)];

module.exports={
    name: 'training',
    description: "Use to get xp for the player or their skills.",
    execute(message, args){

        //Array of possible choices
        const choices = ["1", "2", "3", "4"];

        const filter = m => m.author.id === message.author.id && choices.includes(m.content);

        message.channel.send(item.question).then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    //Check if player got the correct answer
                    if(collected.first().content === item.answers){
                        //Output what the user gained
                        message.channel.send("That is correct!");
                        //Give the user their reward
                    } else {
                        //Output that the user is wrong
                        message.channel.send("That is incorrect. Better luck next time!");
                    }
                })
                .catch(collected => {
                    message.channel.send('**Times up!** Better luck next time.');
                });
        });
    }
}