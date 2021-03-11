//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

//Abstract class for mosnter and recourses
module.exports = class entityTable {
    entities = [];

    // adds the monster to the drop table list
    addEntity(entity) {
        this.entities.push(entity);
    }

    // function to compute the sum of the probability chance of each resource in the list
    probabilitySum() {
        var probSum = 0;
        this.entities.forEach(element => {
            probSum += element.probability;
        });
        return probSum;
    }

};