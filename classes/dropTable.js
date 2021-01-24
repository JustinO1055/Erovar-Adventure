//var resourceDrop = require('./resourceDrop.js');

//Class for a drop table that used the resourceDrop
module.exports = class dropTable {
    resources = [];

    addResource(resourceDrop) {
        this.resources.push(resourceDrop);
    } 

    probabliltySum() {
        var probSum = 0;
        this.resources.forEach(element => {
            probSum += element.probability;
        });
        return probSum;
    }

    determineHit() {
        //Generate random number for determining which item will be recieved
        var randomNum  = randomInteger(1, this.probabliltySum());

        //Used while going through each probability
        var runningValue = 0, resource, resourceAmount;

        //Find which resource is found
        for(let element of this.resources){
            runningValue += element.probability;
            if(randomNum < runningValue){
                resource = element.name;
                resourceAmount = randomInteger(element.quanity[0], element.quanity[1]);
                break;
            }
        }
        return [resource, resourceAmount];
    }
};

// function to generate a random Integer between two numbers
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};