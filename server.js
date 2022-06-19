const express = require("express");
const app = express();
const cors = require("cors");

//config
require("dotenv").config();
const PORT = process.env.PORT || 8080;

// middelware
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

//routes
const inventoriesRoutes = require("./routes/inventories");
app.use("/inventory", inventoriesRoutes);

const warehousesRoutes = require("./routes/warehouses");
app.use("/warehouses", warehousesRoutes);

//server startup
app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
