import React from 'react';
import TableRow from './TableRow';

const Table = ({ transactions, checkedItems, handleCheckboxChange, onDeleteTransaction, onEditTransaction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Transaction Description</th>
            <th className="px-4 py-2 text-left">Original Amount</th>
            <th className="px-4 py-2 text-left">Amount in INR</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <TableRow
              key={index}
              transaction={transaction}
              index={index}
              checked={checkedItems[index]}
              handleCheckboxChange={handleCheckboxChange}
              onDeleteTransaction={onDeleteTransaction}
              onEditTransaction={onEditTransaction} // Pass edit handler
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
