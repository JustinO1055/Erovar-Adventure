//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

//Class for a drop table that used the resourceDrop
module.exports = class dropTable {
    resources = [];

    // adds the resource to the drop table list
    addResource(resourceDrop) {
        this.resources.push(resourceDrop);
    } 

    // function to compute the sum of the probability chance of each resource in the list
    probabliltySum() {
        var probSum = 0;
        this.resources.forEach(element => {
            probSum += element.probability;
        });
        return probSum;
    }

    determineHit() {
        //Generate random number for determining which item will be recieved
        var randomNum  = functions.randomInteger(1, this.probabliltySum());

        //Used while going through each probability
        var runningValue = 1, resource, resourceAmount;

        //Find which resource is found
        for(let element of this.resources){
            runningValue += element.probability;
            if(randomNum < runningValue){
                resource = element.name;
                resourceAmount = functions.randomInteger(element.quanity[0], element.quanity[1]);
                break;
            }
        }
        return [resource, resourceAmount];
    }
};