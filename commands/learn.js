const Discord = require('discord.js');
var functions = require('../functions.js');

const quiz = require('../jsons/learn.json');

module.exports={
    name: 'learn',
    description: "Use to get xp for the player or their skills.",
    execute(message, args){
        // variables for time cooldown
        // Change these values to change the cooldown
        var seconds = 0;
        var minutes = 20;
        var hours = 0;
        //check to ensure that the user is not on cooldown
        var sqlCooldown = `SELECT C.cd_learn, U.admin, U.max_area, U.xp, U.level FROM Cooldown C JOIN Users U ON U.id = C.id WHERE C.id = '${message.author.id}'`;
        connection.query(sqlCooldown, (err2, rows) =>{
            if(err2) throw err2;

            // get the last command time
            var last = rows[0]['cd_learn'];
            // get current time
            var today = new Date();
            // get difference in time from now to last sent
            var diff = Math.abs(today - last);
            // convert the cooldown 
            var cooldown = ((((hours * 60) + minutes) * 60) + seconds)* 1000;

            // if the time is less than the cooldown
            if(diff < cooldown && rows[0].admin != 1){
                // convert to seconds
                var cooldownL = (cooldown - diff)/ 1000;
                var minL = Math.floor(cooldownL / 60);
                var secL = Math.floor(cooldownL % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
                message.reply(`Please wait ${minutes} minutes before sending this command again. You have ${minL}:${secL} left`);
                return;
            // if no longer on cooldown
            } else if(diff >= cooldown || rows[0].admin == 1){

                if(args[0] === "xp" || args[0] === "artisan" || args[0] === "a" || args[0] === "gatherer" || args[0] === "g")
                    var argCheck = true;
                else
                    var argCheck = false;

                if(!argCheck){
                    //set up listening for response
                    let filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'xp' || m.content.toLowerCase() == 'artisatn'|| m.content.toLowerCase()  === "a" || m.content.toLowerCase()  === "gatherer" || m.content.toLowerCase()  === "g");
                    message.channel.send(`What category do you want to learn? \`xp\` | \`gatherer\` | \`artisan\``).then(() => {
                        message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time'] })
                            .then(mes => {
                                //Convert message to lowercase
                                var command = mes.first().content.toLowerCase();

                                // call the quiz
                                learnAsk(command, message, rows);

                            })
                            //If the user doesnt enter a valid response, monster attacks
                            .catch(collected => {
                                message.channel.send(`${message.author} was not paying attention. Learn cancelled.`);
                            });
                        });
                    
                } else {
                    // start the quiz
                    learnAsk(args[0], message, rows);
                }
            }
        });
    }
}

// function to create a random string of emoji from a set list
function randomItemsCount(items){
    // set up variables, count = 0, pick the random item that will be counted in the list, set up string
    let count = 0;
    let random = Math.floor(Math.random() * items.length);
    let string = "";
    // loop 10 times to create a string of items keeping count of a random one
    for(let i = 0; i < 10; i++){
        // find a new random item, if the item picked matches the one to be counted, add to count, add emoji to string
        var randomItem = Math.floor(Math.random() * items.length);
        if(randomItem == random) count++;
        string += `${items[randomItem]} `;
    }

    // return the random item, the string and the count of item
    return [random, string, count];
}

// function to pick a random letter from the string and return it to ask the user to answer
function randomLetter(items){

     // 0 is name, 1 is emoji
    // pick a random item
    let random = Math.floor(Math.random() * items.length);
    // select a word and remove the space
    let word = items[random][0].replaceAll(" ", "");
    // pick a random letter
    let randomLetterNumber = Math.floor(Math.random() * word.length);
    // pick a latter
    randomLetterChosen = word.charAt(randomLetterNumber);

    // add one to randomLetterNumber in order for it to make sense for a human to read
    // starting index at 1
    randomLetterNumber++;
    // put random letter to lowercase
    randomLetterChosen = randomLetterChosen.toLowerCase();

    // return the position, the letter, the emoji
    return[(functions.addOrdinal(randomLetterNumber)), randomLetterChosen, items[random][1]]; 

}

function learnAsk(command, message, rows){

    //Check the arguments to see what the player wants to improve
    //Get the question from the proper category that the player wants to improve
    if(command == "xp"){
        // pick a question to ask
        item = quiz['xp'][Math.floor(Math.random() * quiz['xp'].length)];
        //Get the amount of xp the user is going to get
        // compute it between a range based off area
        var xpGained = functions.randomInteger(150 * Math.pow(rows[0]['max_area'], 2), 250 * Math.pow(rows[0]['max_area'], 2));
        var category = "your player level";
        // declare sql statement for players reward
        var sqlReward = `UPDATE Users SET xp = xp + ${xpGained}`;
    } else if(command == "artisan" || command == "a"){
        // pick a question to ask
        item = quiz['artisan'][Math.floor(Math.random() * quiz['artisan'].length)];
        //Get the amount of xp the user is going to get
        var xpGained = functions.randomInteger(3 * rows[0]['max_area'], 7 * rows[0]['max_area']);
        var category = "Artisan";
        // declare sql statement for players reward
        var sqlReward = `UPDATE Skills SET artisan = artisan + ${xpGained}`;
    } else if(command == "gathering" || command == "g"){
        // pick a question to ask
        item = quiz['gathering'][Math.floor(Math.random() * quiz['gathering'].length)];
        //Get the amount of xp the user is going to get
        var xpGained = functions.randomInteger(3 * rows[0]['max_area'], 7 * rows[0]['max_area'])
        var category = "Gathering";
        // declare sql statement for players reward
        var sqlReward = `UPDATE Skills SET gathering = gathering + ${xpGained}`;
    } else {
        //Output the proper format for the command
        message.channel.send("Invalid category to improve. The proper use of the command is: \`adv learn <category>\`");
        return;
    }              

    // if the question is a predetermined one for random generalization, set up the random question
    if(item.question == "randomLogs" || item.question == "randomOre" || item.question == "randomIngots"){
        // get the list of items
        itemList = item.items;
        // get the random values for the question
        let questionBuild = randomItemsCount(itemList)
        // set up the question and answers
        question = `How many ${itemList[questionBuild[0]]} do you see?\n${questionBuild[1]}`;
        answers = `${questionBuild[2]}`;
    } else if(item.question == "randomLetter"){
        // get the list of items
        itemList = item.items;
        // 0 = position
        // 1 = letter (answer)
        // 2 = emoji
        let questionBuild = randomLetter(itemList);
        question = `What is the ${questionBuild[0]} letter of ${questionBuild[2]}?`;
        answers = `${questionBuild[1]}`; 
    } else {
        // otherwise use the default question and answers
        question = item.question;
        answers = item.answers;
    }

    // set up the filter to only allow for the correct person to respond
    const filter = m => m.author.id === message.author.id;

    message.channel.send(`**${message.author.username}** is attempting to learn.\nThink fast, you have 20 seconds to answer.\n${question}`).then(() => {
        message.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] })
            .then(collected => {
                //Check if player got the correct answer
                if(answers.includes(collected.first().content)){
                    //Output what the user gained
                    message.channel.send(`That is correct! \nYou have gained ${xpGained} experience towards ${category}!`);
                    //Add last part to sql query
                    sqlReward += ` WHERE id = ${message.author.id}`;

                    //Give the user their reward
                    connection.query(sqlReward);
                    //Check if player leveled up
                    /********************* Make this into a function call ************************/
                    if(command == "xp"){
                        //Determine if the player leveled up
                        functions.levelUpCheck((rows[0].xp + xpGained), rows[0].level, message);                        
                    }
                } else {
                    //Output that the user is wrong
                    message.channel.send(`That is incorrect. Better luck next time!\nThe correct answer was **${answers[0]}**`);
                }
            })
            /*.catch(collected => {
                message.channel.send('**Times up!** Better luck next time.');
            });*/
    });

    // add the cooldown to the database
    var sqlCooldownAdd = `UPDATE Cooldown SET cd_learn = NOW() WHERE id = '${message.author.id}'`;
    connection.query(sqlCooldownAdd);
    
}