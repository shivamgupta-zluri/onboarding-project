import React, { useState, useEffect } from 'react';
import axios from 'axios';
import currencySymbols from './currencySymbols'; // Make sure the path is correct

const AddTransaction = ({ isOpen, onClose, onAddTransaction, newTransaction, handleInputChange, today }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/exchangeRates');
        setExchangeRates(response.data);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        alert('Error fetching exchange rates. Please try again.');
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (newTransaction.originalAmount && newTransaction.currency) {
      const upperCaseCurrency = newTransaction.currency.toUpperCase();
      const rate = exchangeRates[upperCaseCurrency];
      if (rate) {
        const amountInINR = (parseFloat(newTransaction.originalAmount) / rate).toFixed(2);
        handleInputChange({
          target: {
            name: 'amountInINR',
            value: amountInINR
          }
        });
      }
    }
  }, [newTransaction.originalAmount, newTransaction.currency, exchangeRates, handleInputChange]);

  const handleAddTransaction = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);

    try {
      // Validate form fields
      if (!newTransaction.transactionDate || !newTransaction.description || !newTransaction.originalAmount || !newTransaction.amountInINR || !newTransaction.currency) {
        alert('Please fill in all fields.');
        setIsSubmitting(false);
        return;
      }

      const formattedTransaction = {
        ...newTransaction,
        originalAmount: parseFloat(newTransaction.originalAmount),
        amountInINR: parseFloat(newTransaction.amountInINR)
      };

      // Make the POST request with formatted data
      await axios.post('http://localhost:4000/api/createTransaction', formattedTransaction);

      // Notify parent component about the new transaction
      onAddTransaction(formattedTransaction); // Pass the new transaction data

      // Close the modal
      onClose();

    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server Error:', error.response.data);
        alert('Error adding transaction. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request Error:', error.request);
        alert('Error adding transaction. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error:', error.message);
        alert('Error adding transaction. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
        <form onSubmit={handleAddTransaction}>
          <div className="mb-4">
            <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">Transaction Date</label>
            <input
              type="date"
              id="transactionDate"
              name="transactionDate"
              value={newTransaction.transactionDate}
              onChange={handleInputChange}
              max={today}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newTransaction.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="originalAmount" className="block text-sm font-medium text-gray-700">Original Amount</label>
            <input
              type="number"
              id="originalAmount"
              name="originalAmount"
              value={newTransaction.originalAmount}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amountInINR" className="block text-sm font-medium text-gray-700">Amount in INR</label>
            <input
              type="number"
              id="amountInINR"
              name="amountInINR"
              value={newTransaction.amountInINR}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              id="currency"
              name="currency"
              value={newTransaction.currency}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              {Object.keys(currencySymbols).map((currencyCode) => (
                <option key={currencyCode} value={currencyCode}>
                  {currencyCode} ({currencySymbols[currencyCode]})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
