//Class for each monster that can be encountered
module.exports = class monsterStats {
    constructor(probability,json, type, area) {
        this.probability = probability;
        this.json = json;
        this.type = type;
        this.area = area;
    }
};