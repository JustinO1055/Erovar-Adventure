// include the json file that holds all of the items names and emoji codes
const {items} = require('../jsons/items.json');

//Include the js file that contains the resourceDrop class
var resourceDrop = require('../classes/resourceDrop.js');
var dropTable = require('../classes/dropTable.js');

var functions = require('../functions.js');

module.exports={
    name: 'mine',
    description: "Used in the area 1 and beyond to get stone and ores for equipment",
    execute(message, args){

        var sqlUser = `SELECT U.area, U.pickaxe, S.gathering FROM Users U INNER JOIN Skills S ON U.id = S.id WHERE U.id = ${message.author.id}`;
        connection.query(sqlUser, (err1, rowsUser) =>{
            if(err1) throw err1;

            // command is only to be used in at least area 1, ensure that the user is not in area 0
            if(rowsUser[0].area == 0){
                message.reply('mine is unlocked in area 1. \n\nUse \`adv h\` for commands.');
                return;
            } else if(rowsUser[0].pickaxe == "NONE"){
                message.reply('You must have a pickaxe to mine. \n\nUse \`adv recipes equipment\` for recipes to make a pickaxe.');
                return;
            }

            // variables for time cooldown
            // Change these values to change the cooldown
            var seconds = 0;
            var minutes = 2;
            var hours = 0;

            //check to ensure that the user is not on cooldown
            var sqlCooldown = `SELECT C.cd_gather, U.admin FROM Cooldown C, Users U WHERE U.id = C.id AND C.id = '${message.author.id}'`;
            connection.query(sqlCooldown, (err2, rowsCD) =>{
                if(err2) throw err2;

                // get the last command time
                var last = rowsCD[0]['cd_gather'];
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
                    //Declare drop table for the find command
                    var findDropTable = new dropTable;

                    //Get a numeric value for the pickaxe the user has
                    switch(rowsUser[0].pickaxe){
                        case "stone_pickaxe":
                            var pickaxe = 1;
                            break;
                        case "copper_pickaxe":
                            var pickaxe = 3;
                            break;
                        case "bronze_pickaxe":
                            var pickaxe = 5;
                            break;
                        case "iron_pickaxe":
                            var pickaxe = 6;
                            break;
                    }

                    //Get players gathering skill level
                    var gatherSkill = functions.skillLevel(rowsUser[0].gathering);

                    //Push default resources into the new drop table
                    //(name, probability, quantity min, quantity max)
                    findDropTable.addEntity(new resourceDrop("pebble", 25, 10, 15));
                    findDropTable.addEntity(new resourceDrop("stone", 20, 2, 4));
                    
                    //Push resources into the drop table depending on players current area
                    switch(rowsUser[0].area){
                        case 1:
                            findDropTable.addEntity(new resourceDrop("copper_ore", 3 * pickaxe, 1 + Math.round(0.25 * gatherSkill[0]), 2 + Math.round(0.25 * gatherSkill[0])));
                            break;
                        case 2:
                            findDropTable.addEntity(new resourceDrop("copper_ore", 2 * pickaxe, 1 + Math.round(0.25 * gatherSkill[0]), 3 + Math.round(0.25 * gatherSkill[0])));
                            findDropTable.addEntity(new resourceDrop("tin_ore", 2 * pickaxe, 1 + Math.round(0.25 * gatherSkill[0]), 3 + Math.round(0.25 * gatherSkill[0])));
                            break;
                        case 3:
                            findDropTable.addEntity(new resourceDrop("copper_ore", 3 * pickaxe, 1 + Math.round(0.25 * gatherSkill[0]), 3 + Math.round(0.25 * gatherSkill[0])));
                            findDropTable.addEntity(new resourceDrop("tin_ore", 3 * pickaxe, 1 + Math.round(0.25 * gatherSkill[0]), 3 + Math.round(0.25 * gatherSkill[0])));
                            findDropTable.addEntity(new resourceDrop("iron_ore", 2 * pickaxe, 1 + Math.round(0.25 * gatherSkill[0]), 3 + Math.round(0.25 * gatherSkill[0])));
                            break;
                    }

                    //Determine which resource is found
                    resource = findDropTable.determineHit();
                    // sql code to input the items into the database
                    let sql = `UPDATE Inventory SET ${resource[0]} = ${resource[0]} + ${resource[1]} WHERE id = '${message.author.id}'`;
                    let sqlSkillUpdate = `UPDATE Skills SET gathering = gathering + ${items[resource[0]].xp} WHERE id = '${message.author.id}'`;
                    connection.query(sqlSkillUpdate);
                    // query the database
                    connection.query(sql, (err, rows) =>{
                        if(err) throw err;

                        // get the emoji code
                        var emoji = items[`${resource[0]}`].emoji;

                        //Generate a message to send to the user
                        var msg = `**${message.author.username}** found ${resource[1]} ${items[resource[0]].name}`;
                        if (resource[1] > 1 && !resource[0].includes("ore")) {msg += "s"} ;   //Determine if 's is needed
                        // append the emoji to the message
                        msg += ` ${emoji}`;
                        message.channel.send(msg);
                    }); 
                    // update the cooldown in database
                    var sql2 = `UPDATE Cooldown SET cd_gather = NOW() WHERE id = '${message.author.id}'`;
                    connection.query(sql2);
                }

            });
        });

    }
}