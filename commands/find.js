// include the json file that holds all of the items names and emoji codes
const {items} = require('../items.json');

//Include the js file that contains the resourceDrop class
var resourceDrop = require('../classes/resourceDrop.js');
var dropTable = require('../classes/dropTable.js');

module.exports={
    name: 'find',
    description: "Used in the first area (area 0) to find resources",
    execute(message, args){

        // command is only to be used in area 0, ensure that the user is in area 0
        var sqlCheck = `SELECT area FROM Users WHERE id = '${message.author.id}'`;
        connection.query(sqlCheck, (err, rows) => {

            // if the user is not in area 0, print a message and return.
            if(rows[0].area != 0){
                message.reply('Find is only to be used within area 0. Use **adv chop** or **adv mine** to find resources. \n\nUse **adv h** for commands.');
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
            }
        });
    }
}