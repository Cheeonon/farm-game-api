const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const userModel = require("./models/userModel");
const housesModel = require("./models/housesModel");
const marketModel = require("./models/marketModel");

const app = express();
app.use(cors());
app.use(express.json());


// get methods
app.get("/user", (req, res) => {
    res.json(userModel.getUserData());
});

app.get("/houses", (req, res) => {
    res.json(housesModel.getHousesData());
});

app.get("/market", (req, res) => {
    res.json(marketModel.getMarketData());
});

const buyHouse = (req, res) => {
    const requestedLevel = req.params.level;
    const housesData = housesModel.getHousesData();
    const requestedHouse = housesData.find((house) => Number(house.level) === Number(requestedLevel));

    console.log(requestedHouse);
    const userData = userModel.getUserData();
    userData.currentHouseLevel = requestedLevel;

    userData.balance = Number(userData.balance) - Number(requestedHouse.price);
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

    // Subtract seed price from balance
    let currentBalance = Number(userData.balance);
    const boughtveggiePrice = Number(buyingveggieMarketData.seedPrice);
    userData.balance = currentBalance - boughtveggiePrice;

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
    const userData = {
        name: "Brad",
        currentVegetables: [],
        balance: 100,
        currentHouseLevel: "1"
    };

    userModel.writeUserDataToJson(userData);

    res.status(201).json({
        message: "Successfully reset"
    });
};

// puts and post
app.put("/buy-house/:level", buyHouse);

app.put("/sell/:id", sellItemWithId);

app.post("/buy/:itemName", buySeedWithName);

app.put("/water/:id", waterPlantWithId);

app.put("/fertilize/:id", fertilizePlantWithId);

app.put("/sleep", sleepAndGetUpNextDay);

app.put("/restart", resetUserData);


app.listen(8080, () => {
    console.log("Server listening on port 8080");
});