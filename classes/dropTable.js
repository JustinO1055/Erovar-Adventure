//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

//Include parent class
const entityTable = require('./entityTable.js');

//Class for a drop table that used the resourceDrop
module.exports = class dropTable extends entityTable {

    determineHit() {
        //Generate random number for determining which item will be recieved
        var randomNum  = functions.randomInteger(1, this.probabilitySum());

        //Used while going through each probability
        var runningValue = 1, resource, resourceAmount;

        //Find which resource is found
        for(let element of this.entities){
            runningValue += element.probability;
            if(randomNum < runningValue){
                resource = element.name;
                resourceAmount = functions.randomInteger(element.quantity[0], element.quantity[1]);
                break;
            }
        }
        return [resource, resourceAmount];
    }
};