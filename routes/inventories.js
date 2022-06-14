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

//get warehouse ID (for POST new inventory item)
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

  //validation
  if (!data.warehouseName) {
    return res.status(400).send("Please enter warehouse name");
  }
  if (!data.itemName) {
    return res.status(400).send("Please enter item name");
  }
  if (!data.description) {
    return res.status(400).send("Please enter item description");
  }
  if (!data.category) {
    return res.status(400).send("Please enter item category");
  }
  if (!data.status) {
    return res.status(400).send("Please enter item status");
  }
  if (!data.quantity && (data.status.toLowerCase() === "in stock")) {
    return res.status(400).send("Please enter item quantity");
  }

  let updatedItems = getInv();
  updatedItems.push(newItem);

  // addToInv(updatedItems);

  res.status(200).send(`${data.itemName} successfully added to ${data.warehouseName} warehouse`);
})

module.exports = router;
