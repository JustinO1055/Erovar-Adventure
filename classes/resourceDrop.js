//Class for each resource that can be dropped
module.exports = class resourceDrop {
    constructor(name, probability, quantityMin, quantityMax) {
        this.name = name;
        this.probability = probability;
        this.quantity = [quantityMin, quantityMax];
    }
};