import React from 'react';
import currencySymbols from './currencySymbols';

const formatDateString = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

const TableRow = ({ transaction, index, checked, handleCheckboxChange, onDeleteTransaction, onEditTransaction }) => {
  return (
    <tr className="border-t">
      <td className="px-4 py-2 text-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => handleCheckboxChange(index)}
        />
      </td>
      <td className="px-4 py-2">{formatDateString(transaction.transactionDate)}</td>
      <td className="px-4 py-2">{transaction.description}</td>
      <td className="px-4 py-2">{`${currencySymbols[transaction.currency]} ${transaction.originalAmount}`}</td>
      <td className="px-4 py-2">{`₹ ${transaction.amountInINR}`}</td>
      <td className="px-4 py-2 flex space-x-2">
        <button className="text-blue-500 hover:text-blue-700" onClick={() => onEditTransaction(transaction)}>
          Edit
        </button>
        <button className="text-red-500 hover:text-red-700" onClick={() => onDeleteTransaction(transaction.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
