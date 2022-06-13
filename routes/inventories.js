const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuid } = require("uuid");

//get vids from JSON - parse for front-end use
const getInv = () => {
  const invList = fs.readFileSync("./data/inventories.json");
  return JSON.parse(invList);
};

//write inv to JSON - stringify for back-end storage
const addToInv = (updatedInv) => {
  fs.writeFileSync("./data/inventories.json", JSON.stringify(updatedInv));
};

//get warehouse ID (for POST-new item)
const warehouseID = (props) => {
  let warehouseList = JSON.parse(fs.readFileSync("./data/warehouses.json"));
  const wareId = warehouseList.find(warehouse => warehouse.name === props.warehouseName).id;
  return wareId;
}

//POST new inventory item
router.post("/", (req, res) => {
  const data = req.body;

  const newItem = {
    id: uuid(),
    warehouseID: warehouseID(data),
    warehouseName: data.warehouseName,
    itemName: data.itemName,
    description: data.description,
    category: data.category,
    status: data.status,
    quantity: data.quantity
  };

  let updatedItems = getInv();
  updatedItems.push(newItem);

  // addToInv(updatedItems);

  res.status(200).send(newItem);
})

module.exports = router;
