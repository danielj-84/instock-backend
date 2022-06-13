const express = require('express');
const router = express.Router();
const fs = require("fs");

//get vids from JSON - parse for front-end use
const getInv = () => {
    const invList = fs.readFileSync("./data/inventories.json");
    return JSON.parse(invList);
  };
  
  //write vids to JSON - stringify for back-end storage
  const addToInv = (updatedInv) => {
    fs.writeFileSync("./data/inventories.json", JSON.stringify(updatedInv));
  };


module.exports = router;