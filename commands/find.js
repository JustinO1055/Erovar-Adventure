module.exports={
    name: 'find',
    description: "Used in the first area to find resources",
    execute(message, args){

        //Class for each resource that can be dropped
        class resourceDrop {
            constructor(name, probability, quanity) {
                this.name = name;
                this.probability = probability;
                this.quanity = quanity;
            }
        }

        //Declare drop table for the find commad
        var findDropTable = [new resourceDrop("stick", 15, 2), new resourceDrop("pebble", 15, 4), new resourceDrop("log", 1, 1), new resourceDrop("stone", 1, 1)];

        //Calculate sum of probabilities in the find Drop Table
        var findProbSum = 0;
        findDropTable.forEach(element => {
            findProbSum += element.probability;
        });

        //Generate random number for determining which item will be recieved
        randomNum  = Math.floor(Math.random() * (findProbSum));

        runningValue = 0;   //Used while going through each probability
        var BreakException = {};    //Used to simulate a break statement within the forEach function
        try {  
            //Find which resource is found
            findDropTable.forEach(element => {
                runningValue += element.probability;
                if(randomNum < runningValue){
                    resource = element.name
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }

        message.channel.send(resource);
    }
}