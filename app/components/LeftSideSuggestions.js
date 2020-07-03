import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

function LeftSideSuggestions() {
  return (
    <div className='hidden lg:block max-w-2xl mx-auto lg:w-3/4 lg:ml-16 lg:rounded-lg mt-10'>
      <h2 className='shadow-sm border-b lg:rounded-t-lg bg-white text-2xl leading-8 font-semibold font-display text-gray-900 sm:leading-9 lg:leading-10 lg:mx-auto pl-3 py-2'>Quick Links</h2>
      <Link className='shadow-sm p-3 bg-white flex items-center border-b hover:bg-gray-100' to='/how-to-bid'>
        <i className='fas fa-file-contract mr-1 text-gray-600'></i>
        How To Bid
      </Link>
      <Link className='shadow-sm p-3 bg-white text-green-600 flex items-center border-b hover:bg-gray-100' to='/create-project'>
        <i className='fas fa-plus mr-1'></i>
        Create Project
      </Link>
      <Link className='shadow-sm p-3 bg-white flex items-center border-b hover:bg-gray-100' to='/reset-password'>
        <i class='fas fa-unlock-alt mr-1 text-gray-600'></i>
        Reset Password
      </Link>
    </div>
  );
}

export default LeftSideSuggestions;
