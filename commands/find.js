// include the json file that holds all of the items names and emoji codes
const {items} = require('../items.json');

module.exports={
    name: 'find',
    description: "Used in the first area to find resources",
    execute(message, args){

        //Class for each resource that can be dropped
        class resourceDrop {
            constructor(name, probability, quanityMin, quanityMax) {
                this.name = name;
                this.probability = probability;
                this.quanity = [quanityMin, quanityMax];
            }
        }

        //Declare drop table for the find commad
        var findDropTable = [new resourceDrop("stick", 15, 1, 4), new resourceDrop("pebble", 15, 1, 5), new resourceDrop("log", 1, 1, 2), new resourceDrop("stone", 1, 1, 2)];

        //Calculate sum of probabilities in the find Drop Table
        var findProbSum = 0;
        findDropTable.forEach(element => {
            findProbSum += element.probability;
        });

        //Generate random number for determining which item will be recieved
        randomNum  = randomInteger(1, findProbSum);

        //Used while going through each probability
        runningValue = 0;

        //Find which resource is found
        for(let element of findDropTable){
            runningValue += element.probability;
            if(randomNum < runningValue){
                resource = element.name;
                resourceAmount = randomInteger(element.quanity[0], element.quanity[1]);
                break;
            }
        }

        // sql code to input the items into the databse
        let sql = `UPDATE Inventory SET ${resource} = ${resource} + ${resourceAmount} WHERE id = '${message.author.id}'`;
        // query the database
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            // get the emoji code
            var emoji = items[`${resource}`].emoji;

            //Generate a message to send to the user
            var msg = "You found " + resourceAmount + " " + resource;
            if (resourceAmount > 1) {msg += "'s"} ;   //Determine if 's is needed
            // append the emoji to the message
            msg += ` ${emoji}`;
            message.channel.send(msg);
        }); 
    }
}

// function to generate a random Integer between two numbers
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};