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

    /* Abstract method for determining a hit
    * Needs to be implemented in subclasses */
    determineHit() {
        throw new Error('You have to implement the method determineHit in sub-class');
     }

};