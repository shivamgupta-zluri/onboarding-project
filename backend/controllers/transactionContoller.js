const Transaction = require("../models/transactionModel");
const csvParser = require("csv-parser");
const fs = require("fs");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

async function getAllTransactions(req, res) {
  try {
    const transactions = await Transaction.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getTransactionById(req, res) {
  const { id } = req.params;
  try {
    const transaction = await Transaction.getTransactionById(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createTransaction(req, res) {
  const {
    transactionDate,
    description,
    originalAmount,
    amountInINR,
    currency,
  } = req.body;
  if (
    !transactionDate ||
    !description ||
    !originalAmount ||
    !amountInINR ||
    !currency
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const transaction = {
    transactionDate,
    description,
    originalAmount,
    amountInINR,
    currency,
  };
  try {
    const newTransaction = await Transaction.createTransaction(transaction);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateTransaction(req, res) {
  const { id } = req.params;
  const {
    transactionDate,
    originalAmount,
    amountInINR,
    description,
    currency,
  } = req.body;

  if (
    !transactionDate ||
    !originalAmount ||
    !amountInINR ||
    !description ||
    !currency
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const transaction = {
    transactionDate,
    originalAmount,
    amountInINR,
    description,
    currency,
  };

  try {
    const updatedTransaction = await Transaction.updateTransaction(
      id,
      transaction
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(updatedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteTransaction(req, res) {
  const { id } = req.params;
  try {
    await Transaction.deleteTransaction(id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function convertDateFormat(dateString) {
  // Split the date string by "-"
  const parts = dateString.split("-");

  // Check if the parts array has exactly three elements (dd, mm, yyyy)
  if (parts.length === 3) {
    // Rearrange the parts into yyyy-mm-dd format
    const yyyy = parts[2];
    const mm = parts[1].padStart(2, "0"); // Ensure mm is two digits
    const dd = parts[0].padStart(2, "0"); // Ensure dd is two digits

    // Return the rearranged date string
    return `${yyyy}-${mm}-${dd}`;
  } else {
    // If the input format is incorrect, return null or throw an error
    console.error("Invalid date format");
    return null;
  }
}

async function uploadCSV(req, res) {
  // Assuming single file upload with field name 'csvFile'
  upload.single("uploadCSV")(req, res, (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(400).json({ error: "Error uploading CSV file" });
    }

    const csvFile = req.body;

    const transactions = csvFile.map((row) => {
      return {
        transactionDate: convertDateFormat(row.transactionDate),
        description: row.description,
        originalAmount: row.originalAmount,
        amountInINR: row.amountInINR,
        currency: row.currency,
      };
    });

    const validationErrors = transactions.filter(
      (transaction) =>
        !transaction.transactionDate ||
        !transaction.description ||
        !transaction.originalAmount ||
        !transaction.amountInINR ||
        !transaction.currency
    );

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Missing required fields in one or more transactions",
      });
    }
  
    for (const transaction of transactions) {
      try {
        
        Transaction.createTransaction(transaction);
      } catch (error) {
        console.error("Error creating transaction:", error);
        return res
          .status(500)
          .json({ error: "Failed to process transactions" });
      }
    }

    // Respond with success message
    res.status(201).json({ message: "CSV data uploaded successfully" });
  });
}

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  uploadCSV,
};
