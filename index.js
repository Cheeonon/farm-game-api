const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const userModel = require("./models/userModel");

const app = express();
app.use(cors());
app.use(express.json());

const getHousesData = () => {
    const housesDataJson = fs.readFileSync("./data/houses.json");
    return JSON.parse(housesDataJson);
}

const getMarketData = () => {
    const marketDataJson = fs.readFileSync("./data/market.json");
    return JSON.parse(marketDataJson);
}


// get methods
app.get("/user", (req, res) => {
    res.json(userModel.getUserData());
});

app.get("/houses", (req, res) => {
    res.json(getHousesData());
});

app.get("/market", (req, res) => {
    res.json(getMarketData());
});


// puts and post
app.put("/buy-house/:level", (req, res) => {
    const requestedLevel = req.params.level;
    const housesData = getHousesData();
    const requestedHouse = housesData.find((house) => Number(house.level) === Number(requestedLevel));

    console.log(requestedHouse);
    const userData = getUserData();
    userData.currentHouseLevel = requestedLevel;

    userData.balance = Number(userData.balance) - Number(requestedHouse.price);
    userModel.writeUserDataToJson(userData);

    res.status(201).json({
        message: "Succesfully bought the house"
    });
});

app.put("/sell/:id", (req, res) => {
    const userData = getUserData();
    const marketData = getMarketData();
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
});

app.post("/buy/:itemName", (req, res) => {
    const userData = getUserData();
    const marketData = getMarketData();
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

});

app.put("/water/:id", (req, res) => {
    const userData = getUserData();
    const currentVegetables = userData.currentVegetables;
    const vegetableToWater = currentVegetables.find((item) => item.id === req.params.id);
    vegetableToWater.isWatered = true;

    userModel.writeUserDataToJson(userData);

    res.status(201).json({
        message: "Succesfully watered the vegetable"
    });
});

app.put("/fertilize/:id", (req, res) => {
    const userData = getUserData();
    const currentVegetables = userData.currentVegetables;
    const vegetableToFertilize = currentVegetables.find((item) => item.id === req.params.id);
    vegetableToFertilize.isFertilized = true;

    userModel.writeUserDataToJson(userData);

    res.status(201).json({
        message: "Succesfully fertilized the vegetable"
    });
});

app.put("/sleep", (req, res) => {
    const userData = getUserData();
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
});

app.put("/restart", (req, res) => {
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
})


app.listen(8080, () => {
    console.log("Server listening on port 8080");
});