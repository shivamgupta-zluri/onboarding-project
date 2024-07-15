// index.js

const express = require("express");
const bodyParser = require("body-parser");
const transactionRoutes = require("../backend/routes/transactionRoutes");
const exchangeRates = require("./exchangeRates");
const cors = require("cors");
const dotenv=require("dotenv")
dotenv.config(); 

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Routes
app.use("/api", transactionRoutes);
app.use("/api", exchangeRates);

app.get("/", function (req, res) {
  res.send("hey");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
