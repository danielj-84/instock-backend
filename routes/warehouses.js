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

//warehouseId route
router
  .route("/:warehouseId")

  //Get a single warehouse
  .get((req, res) => {
    let oneWarehouse = getWare().find(
      (warehouse) => warehouse.id === req.params.warehouseId
    );
    res.status(200).json(oneWarehouse);
  })

  //DELETING a single warehouse

  //Edit a warehouse's data
  .put((req, res) => {
    //Regular Expression for verifying phone and email
    const phoneRegEx = /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/;
    const emailRegEx = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    //Test email against RegEx
    const verifyEmail = (email) => {
      return emailRegEx.test(email);
    };

    //Test phone number against RegEx
    const verifyPhone = (phone) => {
      return phoneRegEx.test(phone);
    };

    //Validating incoming data
    const newData = req.body;
    console.log(newData);
    Object.values(newData).forEach((val) => {
      if (!val) {
        res.status(422).send("Error: Missing data");
      }
    });

    if (!verifyEmail(newData.contact.email)) {
      res.status(422).send({ Error: "Invalid email" });
    } else if (!verifyPhone(newData.contact.phone)) {
      res.status(422).send({ Error: "Invalid phone number" });
    }

    //Enter new warehouse details into warehouses.json
    else {
      //Getting all data
      let allData = getWare();

      //Finding warehouse by ID
      const oldData = allData.find((warehouse) => warehouse.id === req.body.id);

      //Changing warehouse details
      oldData.name = newData.name;
      oldData.address = newData.address;
      oldData.city = newData.city;
      oldData.country = newData.country;
      oldData.contact.name = newData.contact.name;
      oldData.contact.position = newData.contact.position;
      oldData.contact.phone = newData.contact.phone;

      //Replace the old warehouse with the new
      allData.map((warehouse) =>
        warehouse.id === newData.id
          ? (warehouse = newData)
          : (warehouse = warehouse)
      );
      addToWare(allData);
      res.status(201).json(newData);
    }
  });

module.exports = router;
