const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/user", (req, res) => {
    res.send("User path");
});

app.put("/buy-house", (req, res) => {
    res.send("Buy house path");

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



app.listen(8080, () => {
    console.log("Server listening on port 8080");
});