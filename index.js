const express = require("express");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

// helper functions
const getUserData = () => {
    const userDataJson = fs.readFileSync("./data/user.json");
    return JSON.parse(userDataJson);
}

const getHousesData = () => {
    const housesDataJson = fs.readFileSync("./data/houses.json");
    return JSON.parse(housesDataJson);
}

const getMarketData = () => {
    const marketDataJson = fs.readFileSync("./data/market.json");
    return JSON.parse(marketDataJson);
}

app.get("/user", (req, res) => {
    res.json(getUserData());
});

app.put("/buy-house/:level", (req, res) => {
    const requestedLevel = req.params.level;
    const housesData = getHousesData();
    const requestedHouse = housesData.find((house) => Number(house.level) === Number(requestedLevel));

    console.log(requestedHouse);
    const userData = getUserData();
    userData.currentHouseLevel = requestedLevel;

    userData.balance = Number(userData.balance) - Number(requestedHouse.price);
    fs.writeFileSync("./data/user.json", JSON.stringify(userData));

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
    fs.writeFileSync("./data/user.json", JSON.stringify(userData));

    res.status(201).json({
        message: "Succesfully sold the vegetable"
    });
});

app.post("/buy/:itemName", (req, res) => {
    const userData = getUserData();
    const marketData = getMarketData();
    const currentVegetables = userData.currentVegetables;

    const vegiName = req.params.itemName;
    const buyingVegiMarketData = marketData.find((item) => item.name === vegiName);

    const boughtVegi = {
        id: crypto.randomUUID(),
        name: vegiName,
        untilHarvest: buyingVegiMarketData.timeToGrow,
        isWatered: false,
        isFertilized: false
    };

    currentVegetables.push(boughtVegi);
    userData.currentVegetables = currentVegetables;
    fs.writeFileSync("./data/user.json", JSON.stringify(userData));

    res.status(201).json({
        message: "Succesfully bought the vegetable"
    });

});

app.put("/water/:id", (req, res) => {
    const userData = getUserData();
    const currentVegetables = userData.currentVegetables;
    const vegetableToWater = currentVegetables.find((item) => item.id === req.params.id);
    vegetableToWater.isWatered = true;

    fs.writeFileSync("./data/user.json", JSON.stringify(userData));

    res.status(201).json({
        message: "Succesfully watered the vegetable"
    });
});

app.put("/fertilize/:id", (req, res) => {
    const userData = getUserData();
    const currentVegetables = userData.currentVegetables;
    const vegetableToFertilize = currentVegetables.find((item) => item.id === req.params.id);
    vegetableToFertilize.isFertilized = true;

    fs.writeFileSync("./data/user.json", JSON.stringify(userData));

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

    fs.writeFileSync("./data/user.json", JSON.stringify(userData));

    res.status(201).json({
        message: "Vegetables updated for today"
    });
});

app.put("/restart", (req, res) => {
    res.send("Restart path");
})


app.listen(8080, () => {
    console.log("Server listening on port 8080");
});