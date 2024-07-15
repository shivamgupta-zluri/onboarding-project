import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button className="text-white mr-4">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>
      <div className="flex items-center">
        <button className="mr-4 text-white">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div className="flex items-center">
          <img className="h-10 w-10 rounded-full mr-2" src="https://via.placeholder.com/40" alt="User profile" />
          <div className="text-right">
            <p>JASON LEE L.W.</p>
            <p className="text-xs">Sales Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
