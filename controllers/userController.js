const userModel = require("../models/userModel");
const housesModel = require("../models/housesModel");
const marketModel = require("../models/marketModel");
const crypto = require("crypto");

const getUserJson = (req, res) => {
    res.json(userModel.getUserData());
};

const buyHouse = (req, res) => {
    const requestedLevel = req.params.level;
    const housesData = housesModel.getHousesData();
    const requestedHouse = housesData.find((house) => Number(house.level) === Number(requestedLevel));

    const userData = userModel.getUserData();
    userData.currentHouseLevel = requestedLevel;

    const remainingBalance = Number(userData.balance) - Number(requestedHouse.price);
    if (remainingBalance < 0) {
        res.status(400).json({
            message: "Not enough money"
        });
        return;
    }

    userData.balance = remainingBalance;
    userModel.writeUserDataToJson(userData);

    res.status(201).json({
        message: "Succesfully bought the house"
    });
};

const sellItemWithId = (req, res) => {
    const userData = userModel.getUserData();
    const marketData = marketModel.getMarketData();
    const currentVegetables = userData.currentVegetables;
    const vegetableToSell = currentVegetables.find((item) => item.id === req.params.id);

    // Abort if veggie is immature
    if (Number(vegetableToSell.untilHarvest) > 0) {
        res.status(400).json({
            message: "Not ready to harvest"
        });
        return;
    }

    const filteredVegetables = currentVegetables.filter((item) => item.id !== req.params.id);
    userData.currentVegetables = filteredVegetables;

    const vegetableToSellMarketData = marketData.find((item) => item.name === vegetableToSell.name);
    let priceOfVegetable = Number(vegetableToSellMarketData.sellingPrice);

    if (Number(vegetableToSell.untilHarvest) === -1) {
        priceOfVegetable /= 2;
    }

    if (vegetableToSell.isFertilized === "true") {
        priceOfVegetable *= 2;
    }

    userData.balance += priceOfVegetable;
    userModel.writeUserDataToJson(userData);

    res.status(201).json({
        message: "Succesfully sold the vegetable"
    });
};

const buySeedWithName = (req, res) => {
    const userData = userModel.getUserData();
    const marketData = marketModel.getMarketData();
    const currentVegetables = userData.currentVegetables;

    const veggieName = req.params.itemName;
    const buyingveggieMarketData = marketData.find((item) => item.name === veggieName);

    // Subtract seed price from balance
    let currentBalance = Number(userData.balance);
    const boughtveggiePrice = Number(buyingveggieMarketData.seedPrice);

    if (currentBalance - boughtveggiePrice < 0) {
        res.status(400).json({
            message: "Not enough money to buy"
        });
        return;
    }

    userData.balance = currentBalance - boughtveggiePrice;

    // Add newly bought veggie to the array
    const boughtveggie = {
        id: crypto.randomUUID(),
        name: veggieName,
        untilHarvest: buyingveggieMarketData.timeToGrow,
        isWatered: false,
        isFertilized: false
    };
    currentVegetables.push(boughtveggie);
    userData.currentVegetables = currentVegetables;

    userModel.writeUserDataToJson(userData);

    res.status(201).json({
        message: "Succesfully bought the vegetable"
    });

};

const waterPlantWithId = (req, res) => {
    const userData = userModel.getUserData();
    const currentVegetables = userData.currentVegetables;
    const vegetableToWater = currentVegetables.find((item) => item.id === req.params.id);
    vegetableToWater.isWatered = true;

    userModel.writeUserDataToJson(userData);

    res.status(201).json({
        message: "Succesfully watered the vegetable"
    });
};

const fertilizePlantWithId = (req, res) => {
    const userData = userModel.getUserData();
    const currentVegetables = userData.currentVegetables;
    const vegetableToFertilize = currentVegetables.find((item) => item.id === req.params.id);
    vegetableToFertilize.isFertilized = true;

    userModel.writeUserDataToJson(userData);

    res.status(201).json({
        message: "Succesfully fertilized the vegetable"
    });
};

const sleepAndGetUpNextDay = (req, res) => {
    const userData = userModel.getUserData();
    const currentVegetables = userData.currentVegetables;
    currentVegetables.forEach((item) => {
        const untilHarvest = Number(item.untilHarvest);
        
        if ((untilHarvest > 0 && item.isWatered) || untilHarvest <= 0)
            item.untilHarvest = untilHarvest - 1;

        item.isWatered = false;
    })

    const filteredVegetables = currentVegetables.filter((item) => Number(item.untilHarvest) >= -1);
    userData.currentVegetables = filteredVegetables;

    userModel.writeUserDataToJson(userData);

    res.status(201).json({
        message: "Vegetables updated for today"
    });
};

const resetUserData = (req, res) => {
    const newUserData = {
        name: "Brad",
        currentVegetables: [],
        balance: 100,
        currentHouseLevel: "1"
    };

    userModel.writeUserDataToJson(newUserData);

    res.status(201).json({
        message: "Successfully reset"
    });
};

module.exports = {
    getUserJson, 
    buyHouse, 
    sellItemWithId, 
    buySeedWithName,
    waterPlantWithId,
    fertilizePlantWithId,
    sleepAndGetUpNextDay,
    resetUserData
}