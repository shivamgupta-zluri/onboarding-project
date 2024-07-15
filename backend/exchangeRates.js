const express = require("express");
const axios = require("axios");
const router = express.Router();
const dotenv=require("dotenv")
dotenv.config(); 
let cachedRates = null;
let lastFetched = null;

const fetchExchangeRates = async () => {
  const response = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/INR`
  );
  return response.data.conversion_rates;
};

const cacheExchangeRates = async () => {
  cachedRates = await fetchExchangeRates();
  lastFetched = new Date();
};

router.get("/exchangeRates", async (req, res) => {
  const now = new Date();
  if (!cachedRates || now - lastFetched > 3600000) {
    // 1 hour in milliseconds
    await cacheExchangeRates();
  }
  res.json(cachedRates);
});

module.exports = router;
