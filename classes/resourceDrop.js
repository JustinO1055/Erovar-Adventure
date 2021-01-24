//Class for each resource that can be dropped
module.exports = class resourceDrop {
    constructor(name, probability, quanityMin, quanityMax) {
        this.name = name;
        this.probability = probability;
        this.quanity = [quanityMin, quanityMax];
    }
};