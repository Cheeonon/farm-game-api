const fs = require("fs");

const filePath = "./data/user.json";

const getUserData = () => {
    const userDataJson = fs.readFileSync(filePath);
    return JSON.parse(userDataJson);
}

const writeUserDataToJson = (userData) => {
    fs.writeFileSync(filePath, JSON.stringify(userData));
}

module.exports = {getUserData, writeUserDataToJson};