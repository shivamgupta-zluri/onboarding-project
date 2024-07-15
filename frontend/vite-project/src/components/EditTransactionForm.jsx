import React, { useState, useEffect } from 'react';
import axios from 'axios';
import currencySymbols from './currencySymbols'; // Ensure the path is correct

const EditTransaction = ({ isOpen, onClose, transaction, onUpdateTransaction, handleInputChange }) => {
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
    if (transaction && transaction.originalAmount && transaction.currency && exchangeRates) {
      const upperCaseCurrency = transaction.currency.toUpperCase();
      const rate = exchangeRates[upperCaseCurrency];
      if (rate) {
        const amountInINR = (parseFloat(transaction.originalAmount) / rate).toFixed(2);
        handleInputChange({
          target: {
            name: 'amountInINR',
            value: amountInINR
          }
        });
      }
    }
  }, [transaction, exchangeRates, handleInputChange]);

  const handleUpdateTransaction = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);

    try {
      // Validate form fields, keeping previous values if no changes
      const updatedTransaction = {
        ...transaction,
        originalAmount: parseFloat(transaction.originalAmount),
        amountInINR: parseFloat(transaction.amountInINR),
      };

      // Make the PUT request with formatted data
      await axios.put(`http://localhost:4000/api/updateTransaction/${transaction.id}`, updatedTransaction);

      // Notify parent component about the updated transaction
      onUpdateTransaction(transaction.id);

      // Close the modal
      onClose();

    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server Error:', error.response.data);
        alert('Error updating transaction. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request Error:', error.request);
        alert('Error updating transaction. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error:', error.message);
        alert('Error updating transaction. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>
        <form onSubmit={handleUpdateTransaction}>
          <div className="mb-4">
            <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">Transaction Date</label>
            <input
              type="date"
              id="transactionDate"
              name="transactionDate"
              value={transaction.transactionDate}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
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
              value={transaction.description}
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
              value={transaction.originalAmount}
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
              value={transaction.amountInINR}
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
              value={transaction.currency || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="" disabled>Select currency</option>
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
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransaction;
