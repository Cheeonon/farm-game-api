# farm-game-api

## Routes

### GET `/user`
- Returns the user object
#### Response body example
```json
{
    "name": "Brad",
    "currentVegetables": [
        {
            "id": "2e9ff38d-2bc0-4dda-b999-3c3dc5d66589",
            "name": "carrot",
            "untilHarvest": "2",
            "isWatered": false,
            "isFertilized": false
        },
        {
            "id": "6251fe2b-1084-42a3-b396-e4a6ed9d04de",
            "name": "tomato",
            "untilHarvest": "3",
            "isWatered": false,
            "isFertilized": false
        }
    ],
    "balance": 100,
    "currentHouseLevel": "1"
}
```

### GET `/market`
- Returns the market array
#### Response body example
```json
[
  {
    "name": "carrot",
    "timeToGrow": "2",
    "seedPrice": "5",
    "sellingPrice": "30",
    "image": "#"
  },
  {
    "name": "tomato",
    "timeToGrow": "3",
    "seedPrice": "10",
    "sellingPrice": "40",
    "image": "#"
  },
  {
    "name": "cucumber",
    "timeToGrow": "4",
    "seedPrice": "10",
    "sellingPrice": "50",
    "image": "#"
  }
]
```

### GET `/houses`
- Returns the houses array
#### Response body example
```json
[
  {
    "level": 1,
    "name": "poor house",
    "image": "#",
    "price": 100
  },
  {
    "level": 2,
    "name": "mint house",
    "image": "#",
    "price": 200
  }
]
```

### PUT `/buy-house/:level`
- Sets user's currentHouseLevel to the requested level
- Subtracts the house's price from balance
- When not enough money, sends back status 400
- Sends back a success message

### PUT `/sell/:id`
- Remove the veggie with the id from user's currentVegetables array
- Add the sold price to the balance
- if untilHarvest is -1, only half the price is added
- If isFertilized is true, double the price
- If veggie not mature yet, sends back status 400
- Sends back a success message

### POST `/buy/:itemName`
- Add the item with the name to the array
- Generates random id and give it to the item
- Subtract the seed price from the balance
- If not enough balance to buy, sends back status 400
- Sends back a success message

### PUT `/water/:id`
- Find the item in the array by the id and set isWatered value to 'true'
- Sends back a success message

### PUT `/fertilize/:id`
- Find the item in the array by the id and set isFertilized value to 'true'
- Sends back a success message

### PUT `/sleep`
- Loop through every veggie in the array
- if untilHarvest is larger than 0 and isWatered is true, subtract 1 from untilHarvest
- If untilHarvest is less than or equal to 0, subtract 1 from untilHarvest
- Set isWatered to true
- Loop through again to remove any items whose untilHarvest value is less than -1 (Rotton ones)
- Sends back a success message

### PUT `/restart`
- Reset user data to have an empty array for veggies, level of 1 and balance of 100
