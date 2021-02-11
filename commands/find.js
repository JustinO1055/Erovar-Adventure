// include the json file that holds all of the items names and emoji codes
const {items} = require('../jsons/items.json');

//Include the js file that contains the resourceDrop class
var resourceDrop = require('../classes/resourceDrop.js');
var dropTable = require('../classes/dropTable.js');

module.exports={
    name: 'find',
    description: "Used in the first area (area 0) to find resources",
    execute(message, args){

        // variables for time cooldown
        // Change these values to change the cooldown
        var seconds = 0;
        var minutes = 2;
        var hours = 0;

        //check to ensure that the user is not on cooldown
        var sqlCooldown = `SELECT cd_gather FROM Cooldown WHERE id = '${message.author.id}'`;
        connection.query(sqlCooldown, (err, rowsCD) =>{
            if(err) throw err;

            // get the last command time
            var last = rowsCD[0]['cd_gather'];
            // get current time
            var today = new Date();
            // get difference in time from now to last sent
            var diff = Math.abs(today - last);
            // convert the cooldown 
            var cooldown = ((((hours * 60) + minutes) * 60) + seconds)* 1000;

            // if the time is less than the cooldown
            if(diff < cooldown){
                // convert to seconds
                var cooldownL = (cooldown - diff)/ 1000;
                var minL = Math.floor(cooldownL / 60);
                var secL = Math.floor(cooldownL % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
                message.reply(`Please wait ${minutes} minutes before sending this command again. You have ${minL}:${secL} left`);
                return;
            // if no longer on cooldown
            } else if(diff >= cooldown){
                // command is only to be used in area 0, ensure that the user is in area 0
                var sqlCheck = `SELECT area FROM Users WHERE id = '${message.author.id}'`;
                connection.query(sqlCheck, (err, rows) => {

                    // if the user is not in area 0, print a message and return.
                    if(rows[0].area != 0){
                        message.reply('Find is only to be used within area 0. Use \`adv chop\` or \`adv mine\` to find resources. \n\nUse \`adv h\` for commands.');
                    } else {
                        //Declare drop table for the find commandd
                        var findDropTable = new dropTable;

                        //Push resources into the new drop table
                        findDropTable.addResource(new resourceDrop("stick", 15, 1, 4));
                        findDropTable.addResource(new resourceDrop("pebble", 15, 1, 5));
                        findDropTable.addResource(new resourceDrop("log", 1, 1, 2));
                        findDropTable.addResource(new resourceDrop("stone", 1, 1, 2));
                        //var findDropTable = [new resourceDrop("stick", 15, 1, 4), new resourceDrop("pebble", 15, 1, 5), new resourceDrop("log", 1, 1, 2), new resourceDrop("stone", 1, 1, 2)];

                        //Determine which reource is found
                        resource = findDropTable.determineHit();
                        // sql code to input the items into the databse
                        let sql = `UPDATE Inventory SET ${resource[0]} = ${resource[0]} + ${resource[1]} WHERE id = '${message.author.id}'`;
                        // query the database
                        connection.query(sql, (err, rows) =>{
                            if(err) throw err;

                            // get the emoji code
                            var emoji = items[`${resource[0]}`].emoji;

                            //Generate a message to send to the user
                            var msg = "You found " + resource[1] + " " + resource[0];
                            if (resource[1] > 1) {msg += "'s"} ;   //Determine if 's is needed
                            // append the emoji to the message
                            msg += ` ${emoji}`;
                            message.channel.send(msg);
                        }); 
                        // update the cooldown in database
                        var sql2 = `UPDATE Cooldown SET cd_gather = NOW() WHERE id = '${message.author.id}'`;
                        connection.query(sql2);
                    }
                });
            }

        });

    }
}