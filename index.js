const express = require("express");
const cors = require("cors");
const fs = require("fs");

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
    res.send("sell path");

});

app.post("/buy", (req, res) => {
    res.send("Buy path");

});

app.put("/water", (req, res) => {
    res.send("water path");

});

app.put("/fertilize", (req, res) => {
    res.send("fertilize path");

});

app.put("/sleep", (req, res) => {
    res.send("sleep path");

});

app.put("/restart", (req, res) => {
    res.send("Restart path");
})


app.listen(8080, () => {
    console.log("Server listening on port 8080");
});