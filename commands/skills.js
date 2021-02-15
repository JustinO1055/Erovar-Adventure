const Discord = require('discord.js');
var functions = require('../functions.js');

module.exports={
    name: 'skills',
    description: "Used to see the players skills and progress in those skills",
    execute(message, args){
        //Create sql to get the users skills from db
        let sqlSkills = `SELECT gathering, artisan FROM Skills WHERE id = ${message.author.id}`
        connection.query(sqlSkills, (err1, rowsSkills) =>{
            if(err1) throw err1;

            //Define skill output to empty string
            skillOutput = " ";

            //Loops through the skills in the db and generate the output
            for(skill in rowsSkills[0]){
                currentSkillProgress = functions.skillLevel(rowsSkills[0][skill]);
                skillOutput += `**${functions.capFirstLetter(skill)}:** Level ${currentSkillProgress[0]} | ${currentSkillProgress[1]}/500\n${currentSkillProgress[2]}\n\n`
            }

            //Create the embed to output
            const skillsEmbed = new Discord.MessageEmbed()
                .setColor('#00a83e')
                .setAuthor(message.author.username + '\'s Skills', message.author.avatarURL())
                .setDescription(skillOutput);

            message.channel.send(skillsEmbed);

        });
    }
}