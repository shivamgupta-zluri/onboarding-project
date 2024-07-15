import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './tailwind.css';
import Header from './components/Header';
import Table from './components/Table';
import EditTransaction from './components/EditTransactionForm';
import AddTransaction from './components/AddTransaction';
import UploadCSVModal from './components/UploadCSVModal';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false); // State for CSV upload modal
  const [selectedTransaction, setSelectedTransaction] = useState(null); // State to store selected transaction for edit
  const [newTransaction, setNewTransaction] = useState({
    transactionDate: '',
    description: '',
    originalAmount: '',
    amountInINR: '',
    currency: 'USD' // Default currency
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(transactions.length / rowsPerPage);
    setTotalPages(totalPages);
  }, [transactions, rowsPerPage]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/getAllTransactions');
      const formattedTransactions = response.data.map(transaction => ({
        transactionDate: transaction.transaction_date,
        description: transaction.description,
        originalAmount: transaction.original_amount,
        amountInINR: transaction.amount_in_inr,
        id: transaction.id,
        currency: transaction.currency
      }));
      setTransactions(formattedTransactions);
      setCheckedItems(new Array(formattedTransactions.length).fill(false));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleCheckboxChange = (position) => {
    const updatedCheckedItems = checkedItems.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedItems(updatedCheckedItems);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTransaction(prevState => ({ ...prevState, [name]: value }));
  };

  const onAddTransaction = async (formattedTransaction) => {
    try {
      setIsModalOpen(false);
      setNewTransaction({
        transactionDate: '',
        description: '',
        originalAmount: '',
        amountInINR: '',
        currency: 'USD'
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const onUpdateTransaction = async (id) => {
    try {
      const updatedTransaction = {
        transactionDate: selectedTransaction.transactionDate,
        description: selectedTransaction.description,
        originalAmount: parseFloat(selectedTransaction.originalAmount),
        amountInINR: parseFloat(selectedTransaction.amountInINR),
        currency: selectedTransaction.currency
      };

      const response = await axios.put(`http://localhost:4000/api/updateTransaction/${id}`, updatedTransaction);
      console.log('Update response:', response.data);

      fetchTransactions();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
      console.error('Error response data:', error.response.data);
      alert('Error updating transaction. Please try again.');
    }
  };

  const onDeleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/deleteTransaction/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleCSVUploadSuccess = (newTransactions) => {
    fetchTransactions();
  };

  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const today = new Date().toISOString().split('T')[0];

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-6 w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transactions</h2>
            <div>
              <button onClick={() => setIsCSVModalOpen(true)} className="bg-purple-500 text-white py-2 px-4 rounded mr-2">UPLOAD CSV</button>
              <button onClick={() => setIsModalOpen(true)} className="bg-purple-500 text-white py-2 px-4 rounded">ADD TRANSACTION</button>
            </div>
          </div>
          <Table
            transactions={currentTransactions}
            checkedItems={checkedItems}
            handleCheckboxChange={handleCheckboxChange}
            onDeleteTransaction={onDeleteTransaction}
            onEditTransaction={(transaction) => {
              setSelectedTransaction(transaction);
              setIsEditModalOpen(true);
            }}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
              <select id="rowsPerPage" value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))} className="border p-2">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="flex items-center">
              <span>{`Showing ${indexOfFirstTransaction + 1}-${Math.min(indexOfLastTransaction, transactions.length)} of ${transactions.length}`}</span>
              <button onClick={prevPage} disabled={currentPage === 1} className="mx-2 text-gray-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button onClick={nextPage} disabled={currentPage === totalPages} className="mx-2 text-gray-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <AddTransaction
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTransaction={onAddTransaction}
          newTransaction={newTransaction}
          handleInputChange={handleInputChange}
          today={today}
        />
        <EditTransaction
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          transaction={selectedTransaction}
          onUpdateTransaction={onUpdateTransaction}
          handleInputChange={handleEditInputChange}
        />
        <UploadCSVModal
          isOpen={isCSVModalOpen}
          onClose={() => setIsCSVModalOpen(false)}
          onUploadSuccess={handleCSVUploadSuccess}
        />
      </main>
    </div>
  );
};

export default App;
