const housesModel = require("../models/housesModel");

const getHouseJson = (req, res) => {
    res.json(housesModel.getHousesData());
};

module.exports = {getHouseJson};