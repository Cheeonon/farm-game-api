const fs = require("fs");

const filePath = "./data/houses.json";

const getHousesData = () => {
    const housesDataJson = fs.readFileSync(filePath);
    return JSON.parse(housesDataJson);
}

module.exports = {getHousesData};