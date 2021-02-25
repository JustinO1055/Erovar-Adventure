const Discord = require('discord.js');

module.exports={
    name: 'start',
    description: "Code to input the user into the databases to begin playing the bot",
    execute(message, args){

        // check if user exists
        let sql = `SELECT * FROM Users WHERE id = '${message.author.id}'`;
        connection.query(sql, (err, rows) =>{

            // if user already exists. print a message telling them so
            if(rows.length != 0){
                message.reply("You have already began your journey into Erovar.\nUse \`adv h\` for commands.");
            } else {
            // check to make sure they dont have an account
            // add the user to the various database tables
            let sql2 = `INSERT INTO Users(id) VALUES ('${message.author.id}')`;
            let sql3 = `INSERT INTO Inventory(id) VALUES ('${message.author.id}')`;
            let sql4 = `INSERT INTO Cooldown(id) VALUES ('${message.author.id}')`;
            let sql5 = `INSERT INTO Skills(id) VALUES ('${message.author.id}')`;
            let sql6 = `INSERT INTO Stats(id) VALUES ('${message.author.id}')`;
            connection.query(sql2);
            connection.query(sql3);
            connection.query(sql4);
            connection.query(sql5);
            connection.query(sql6);

            //Create the embed to start message
            const startEmbed = new Discord.MessageEmbed()
            .setColor('#0a008c')
            .setTitle(`Welcome to Erovar, ${message.author.username}`)
            .setDescription(`Your journey into Erovar has just begun. You have found yourself in a new unknown area surrounded by some rocks. some foliage, and most importantly some scary monsters. You wander around a bit coming to the realization the only way to progress is to defeat these monsters and ultimately the scary boss blocking the path.
            \nYour goal now becomes, gather resources, defeat monsters, and progress through the areas to become stronger and unlock new features.`)
            .addFields(
                { name: '**How To Play**', value: `Your goal now is to gather XP to level up, gold to buy items/ upgrades and gather resources to craft new equipment. You can obtain XP and gold through using \`adv battle\` and \`adv expedition\` to fight monsters and get these rewards. You can view your xp, gold and progress by using \`adv profile\`. Warning: If you die your progress towards the next level will be **reset**.
                \nAdditionally, you will need to obtain resources to craft new equipment. You can start by gathering these resources by using \`adv find\`. You can view all your resources by using \`adv inventory\``},
                {name: `**Crafting and Recipes**`, value: `Once you have the resources, you are able to craft more items. You can use \`adv recipes\` to see the available items to craft. Once you have all the resources, you can craft the item by using \`adv craft <item>\`. Note: If you want to dissassemble an item to get some resources back, you can use \`adv dissassemble <item>\` to get 50% of the materials back (can not dissassemble equipment). `},
                {name: `**Boss Fights**`, value: `When you feel prepared and have the necessary requirements meant for the boss fight, you can enter the fight by using \`adv boss\`. If you are able to defeat the boss, you will unlock the next area with more exciting things to discover.`},
                {name: `**Other**`, value: `There are more commands that can be used, these commands can be found by using \`adv help\` where you will also find more information on these commands.
                \nMost importantly **HAVE FUN** and good luck on your adventure throughout Erovar!`}            
            );

            message.channel.send(startEmbed);
            }
        });
    }
}
