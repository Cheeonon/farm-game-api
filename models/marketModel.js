const fs = require("fs");

const filePath = "./data/market.json";

const getMarketData = () => {
    const marketDataJson = fs.readFileSync(filePath);
    return JSON.parse(marketDataJson);
}

module.exports = {getMarketData};