const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionContoller");

router.get("/getAllTransactions", transactionController.getAllTransactions);
router.get("/getTransactionById/:id", transactionController.getTransactionById);
router.post("/createTransaction", transactionController.createTransaction);
router.put("/updateTransaction/:id", transactionController.updateTransaction);
router.delete(
  "/deleteTransaction/:id",
  transactionController.deleteTransaction
);
router.post("/uploadCSV", transactionController.uploadCSV);

module.exports = router;
