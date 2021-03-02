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
        var sqlCooldown = `SELECT C.cd_learn, U.admin FROM Cooldown C, Users U WHERE U.id = C.id AND C.id = '${message.author.id}'`;
        connection.query(sqlCooldown, (err2, rowsCD) =>{
            if(err2) throw err2;

            // get the last command time
            var last = rowsCD[0]['cd_learn'];
            // get current time
            var today = new Date();
            // get difference in time from now to last sent
            var diff = Math.abs(today - last);
            // convert the cooldown 
            var cooldown = ((((hours * 60) + minutes) * 60) + seconds)* 1000;

            // if the time is less than the cooldown
            if(diff < cooldown && rowsCD[0].admin != 1){
                // convert to seconds
                var cooldownL = (cooldown - diff)/ 1000;
                var minL = Math.floor(cooldownL / 60);
                var secL = Math.floor(cooldownL % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
                message.reply(`Please wait ${minutes} minutes before sending this command again. You have ${minL}:${secL} left`);
                return;
            // if no longer on cooldown
            } else if(diff >= cooldown || rowsCD[0].admin == 1){

                // pick a question to ask
                //item = quiz[Math.floor(Math.random() * quiz.length)];
                item = quiz[quiz.length - 1];

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

                // add the cooldown to the database
                var sqlCooldownAdd = `UPDATE Cooldown SET cd_learn = NOW() WHERE id = '${message.author.id}'`;
                connection.query(sqlCooldownAdd);
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