const express = require("express");
const cors = require("cors");
const houseController = require("./controllers/housesController");
const marketController = require("./controllers/marketController");
const userController = require("./controllers/userController");

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());



// get methods
app.get("/user", userController.getUserJson);

app.get("/houses", houseController.getHouseJson);

app.get("/market", marketController.getMarketJson);

// puts and post
app.put("/buy-house/:level", userController.buyHouse);

app.put("/sell/:id", userController.sellItemWithId);

app.post("/buy/:itemName", userController.buySeedWithName);

app.put("/water/:id", userController.waterPlantWithId);

app.put("/fertilize/:id", userController.fertilizePlantWithId);

app.put("/sleep", userController.sleepAndGetUpNextDay);

app.put("/restart", userController.resetUserData);


app.listen(PORT, () => {
    console.log("Server listening on port ", PORT);
});