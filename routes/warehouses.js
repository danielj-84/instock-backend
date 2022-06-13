const express = require('express');
const router = express.Router();
const fs = require("fs");

//get vids from JSON - parse for front-end use
const getWare = () => {
    const wareList = fs.readFileSync("./data/warehouses.json");
    return JSON.parse(invList);
  };
  
  //write vids to JSON - stringify for back-end storage
  const addToWare = (updatedWare) => {
    fs.writeFileSync("./data/warehouses.json", JSON.stringify(updatedWare));
  };

module.exports = router;