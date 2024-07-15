const { Pool } = require("pg");
const dotenv=require("dotenv")
dotenv.config(); 

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test",
  password: `${process.env.PASSWORD}`,
  port: 5432,
});

const createTableIfNotExists = async () => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        transaction_date DATE NOT NULL,
        description TEXT NOT NULL,
        original_amount DECIMAL NOT NULL,
        amount_in_inr DECIMAL NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD' NOT NULL -- New column for currency type
      );
    `;

  try {
    await pool.query(createTableQuery);
    console.log("Checked for table and created if not exists.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

createTableIfNotExists();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
