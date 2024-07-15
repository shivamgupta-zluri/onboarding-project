const pool = require("../db");

async function getAllTransactions() {
  const query = "SELECT * FROM transactions ORDER BY id DESC";
  const { rows } = await pool.query(query);
  return rows;
}

async function getTransactionById(id) {
  const query = "SELECT * FROM transactions WHERE id = $1";
  const values = [id];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function createTransaction(transaction) {
  const {
    transactionDate,
    description,
    originalAmount,
    amountInINR,
    currency,
  } = transaction;
  const query =
    "INSERT INTO transactions (transaction_date, description, original_amount, amount_in_inr, currency) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const values = [
    transactionDate,
    description,
    originalAmount,
    amountInINR,
    currency,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function updateTransaction(id, transaction) {
  const {
    transactionDate,
    originalAmount,
    amountInINR,
    description,
    currency,
  } = transaction;
  const query =
    "UPDATE transactions SET transaction_date = $1, original_amount = $2, amount_in_inr = $3, description = $4, currency = $5 WHERE id = $6 RETURNING *";
  const values = [
    transactionDate,
    originalAmount,
    amountInINR,
    description,
    currency,
    id,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function deleteTransaction(id) {
  const query = "DELETE FROM transactions WHERE id = $1";
  const values = [id];
  await pool.query(query, values);
}

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
