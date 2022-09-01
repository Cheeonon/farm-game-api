const marketModel = require("../models/marketModel");

const getMarketJson = (req, res) => {
    res.json(marketModel.getMarketData());
};

module.exports = {getMarketJson};