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

        //Generate a message to send to the user
        var msg = "You found " + resourceAmount + " " + resource;
        (resourceAmount > 1)?(msg += "'s."):(msg += ".");   //Determine if 's is needed
        message.channel.send(msg);
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};