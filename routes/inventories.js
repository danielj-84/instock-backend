const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuid } = require("uuid");

//get inv from JSON - parse for front-end use
const getInv = () => {
  const invList = fs.readFileSync("./data/inventories.json");
  return JSON.parse(invList);
};

//write inv to JSON - stringify for back-end storage
const addToInv = (updatedInv) => {
  fs.writeFileSync("./data/inventories.json", JSON.stringify(updatedInv));
};

//get list of all warehouses, needed for editing inventory item
const getWare = () => {
  const wareList = fs.readFileSync("./data/warehouses.json");
  return JSON.parse(wareList);
};

//GETTING all inventory info from JSON file
router.get("/", (_req, res) => {
  let inventory = getInv().map((inventory) => {
    return {
      id: inventory.id,
      warehouseID: inventory.warehouseID,
      warehouseName: inventory.warehouseName,
      itemName: inventory.itemName,
      description: inventory.description,
      category: inventory.category,
      status: inventory.status,
      quantity: inventory.quantity,
    };
  });
  res.status(200).json(inventory);
});

//inventoryID route
router
  .route("/:inventoryId")

  //GETTING a single item
  .get((req, res) => {
    let oneItem = getInv().find(
      (inventory) => inventory.id === req.params.inventoryId
    );
    res.status(200).json(oneItem);
  })

  //edit a single inventory item
  .put((req, res) => {
    const newData = req.body;
    Object.values(newData).forEach((val) => {
      if (!val) {
        return res
          .status(422)
          .send("Error: Missing data. Please fill out all required fields");
      }
    });

    let allData = getInv();

    const oldData = allData.find((item) => item.id === req.params.inventoryId);
    oldData.itemName = newData.itemName;
    oldData.status = newData.status;
    oldData.quantity = newData.quantity;
    oldData.warehouseName = newData.warehouseName;
    oldData.warehouseID = getWare().find(
      (warehouse) => warehouse.name === newData.warehouse
    );
    oldData.description = newData.description;
    oldData.category = newData.category;

    allData.map((item) => {
      item.id === newData.id ? (item = newData) : (item = item);
    });
    addToInv(allData);
    res.status(201).json(newData);
  });

//get warehouse ID (for POST new inventory item)
const warehouseID = (props) => {
  let warehouseList = JSON.parse(fs.readFileSync("./data/warehouses.json"));
  const wareId = warehouseList.find(
    (warehouse) => warehouse.name === props.warehouseName
  ).id;
  return wareId;
};

//DELETING a single item
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const inventoryData = getInv();

  const foundInventory = inventoryData.find((item) => item.id === id);

  if (foundInventory !== undefined) {
    updatedInventoryData = inventoryData.filter((item) => item.id !== id);
    addToInv(updatedInventoryData);
    res.status(200).send(`Item ${id} was deleted`);
  } else {
    res.status(404).send("item not found");
  }
});

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
    quantity: data.quantity,
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
  if (!data.quantity && data.status.toLowerCase() === "in stock") {
    return res.status(400).send("Please enter item quantity");
  }

  let updatedItems = getInv();
  updatedItems.push(newItem);

  // addToInv(updatedItems);

  res
    .status(200)
    .send(
      `${data.itemName} successfully added to ${data.warehouseName} warehouse`
    );
});

module.exports = router;
