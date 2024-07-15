import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const UploadCSVModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Fetch exchange rates from the server
      const response = await axios.get('http://localhost:4000/api/exchangeRates');
      const rates = response.data;

      Papa.parse(selectedFile, {
        header: true, // Treats the first row as headers
        skipEmptyLines: true, // Skip empty lines
        complete: async (result) => {
          const transactions = result.data;

          const errors = [];
          const today = new Date().toISOString().split('T')[0];

          const processedTransactions = transactions.map((transaction, index) => {
            // Adjusting to match the CSV file headers exactly
            const { Date: date, Description: description, Amount: originalAmount, Currency: currency } = transaction;
           // console.log(transaction);

            if (!date || !description || !originalAmount || !currency) {
              errors.push(`Row ${index + 1}: One or more fields are missing.`);
              return null;
            }

            if (new Date(date) > new Date(today)) {
              errors.push(`Row ${index + 1}: Date ${date} is in the future.`);
              return null;
            }

            const upperCaseCurrency = currency.toUpperCase();
            if (!rates[upperCaseCurrency]) {
              errors.push(`Row ${index + 1}: Currency ${upperCaseCurrency} is not supported.`);
              return null;
            }

            const amountInINR = (parseFloat(originalAmount) / rates[upperCaseCurrency]).toFixed(2);

            return {
              transactionDate: date,
              description: description,
              originalAmount: parseFloat(originalAmount),
              amountInINR: parseFloat(amountInINR),
              currency: upperCaseCurrency
            };
          });

          const validTransactions = processedTransactions.filter(transaction => transaction !== null);

          if (errors.length > 0) {
            alert(`Errors occurred:\n${errors.join('\n')}`);
            setIsSubmitting(false);
            return;
          }

          //console.log(validTransactions);
          // Send valid transactions to backend
          await axios.post('http://localhost:4000/api/uploadCSV', validTransactions);

          // Notify parent component and close modal
          onUploadSuccess(validTransactions);
          onClose();
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          alert('Error parsing CSV file. Please check the file format.');
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Error uploading CSV. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-xl font-semibold mb-4">Upload CSV</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCSVModal;
