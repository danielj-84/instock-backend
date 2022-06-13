const express = require("express");
const router = express.Router();
const fs = require("fs");

//get vids from JSON - parse for front-end use
const getWare = () => {
  const wareList = fs.readFileSync("./data/warehouses.json");
  return JSON.parse(wareList);
};

//write vids to JSON - stringify for back-end storage
const addToWare = (updatedWare) => {
  fs.writeFileSync("./data/warehouses.json", JSON.stringify(updatedWare));
};

//GET all warehouse info from JSON file
router.get("/", (_req, res) => {
  let warehouses = getWare().map((warehouse) => {
    return {
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
      city: warehouse.city,
      country: warehouse.country,
      contact: {
        name: warehouse.contact.name,
        position: warehouse.contact.position,
        phone: warehouse.contact.phone,
        email: warehouse.contact.email,
      },
    };
  });
  res.status(200).json(warehouses);
});

module.exports = router;
